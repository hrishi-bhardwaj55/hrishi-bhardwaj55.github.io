# One dataset, three ways to think about storage

In a database tutorial, the data usually arrives in exactly the shape the example needs. This project was more interesting: roughly 1.47 million rows of Yelp data, spread across five TSV files, and several different ways of asking questions about them. I worked through relational queries, document queries, Redis data structures and a reservation lock in one week.

The useful connection was not the number of databases. Each part exposed a different assumption: which population an aggregate describes, whether a field is actually structured, or who still owns a resource after a timeout. I started with query correctness and finished thinking about concurrent clients.

## Keeping the question inside SQL

The SQL exercises required each answer to come from a single statement. That restriction made the database responsible for filtering, aggregation and ordering. I could not fetch a broad result and quietly repair its meaning in Java.

One query looked for businesses in South Side with `Coast` in their name that had never received a check-in. I used a binary name comparison for the case-sensitive match and a correlated `NOT EXISTS` against the check-ins table. Those choices expressed two distinct requirements: match the exact capitalization, and exclude a business if any corresponding check-in exists.

Another question asked for the coolest review among users who had written at least one tip. The subtle part was the maximum. Computing it across every review would answer a different question. I kept the eligible-user condition inside the subquery that computed the maximum, so the comparison and the returned rows described the same population.

For the city ranking, grouping by city and ordering by average stars was only half the answer. I also sorted by city name to make ties deterministic before applying the limit. Small details like these are easy to miss when the output looks plausible.

:::diagram storage-models

## Asking the database how it found the answer

I added an index on the reviews' `cool` field and compared `EXPLAIN` output before and after. The useful result recorded in my build log was the change in access path from a scan to a lookup. I did not record a before-and-after latency figure, so I describe the query-plan improvement rather than attach a speedup to it.

The project also included a Hibernate migration from an eleven-column SQLite schema to a fifteen-column MySQL table, with the application entry point kept fixed. That exercise put a boundary around the work: adapt the entity mapping and configuration so the rest of the application can keep talking to the same abstraction. It was a practical way to think about how far an ORM should shield application code from storage changes.

## A document field can still be a string

The MongoDB queries ran against Cosmos DB for MongoDB on Azure. One surprise was the representation of Yelp's attributes and opening hours. They looked like dictionaries to a person reading the input, but arrived as strings containing Python-style dictionary text.

That meant a nested-field query was the wrong tool. For conditions such as free Wi-Fi and bike parking, I combined regular-expression filters over the stored attribute string. Sorting stayed in the MongoDB driver query, and distinct-city counting used `collection.distinct`. I was careful to query the representation I had, not the document structure I wished had been imported.

This approach was a fit for the supplied dataset. If I were designing a longer-lived ingestion pipeline, converting those fields into actual nested documents would be a separate modelling decision to evaluate.

## The lock is more than an expiry

The final part used Redis for a marketplace reservation exercise. Acquiring the lock combined set-if-absent with an expiry: `SET` with `NX` and `EX`. The stored value identified the client. The expiry prevented an abandoned lock from lasting indefinitely.

Release needed more care. A client can pause long enough for its lock to expire and another client to acquire the same key. An unconditional delete would then remove someone else's lock. Even reading the owner before deleting leaves a race between those two operations.

I used `WATCH`, checked the stored owner, and only queued the delete through `MULTI` and `EXEC` when ownership matched. A concurrent modification makes that transaction abort; a mismatched owner takes the `UNWATCH` path. The key idea was to make deletion depend on the ownership check remaining valid.

:::diagram storage-lock-release

## What stayed with me

The coursework also asked for a small HashMap-backed Redis clone with hash and list operations, making the difference between a string cache and a data-structure server concrete. The reservation exercise then showed why a convenient API does not remove the need to reason about state changes.

My strongest takeaway was to write down the invariant before choosing the mechanism. SQL had to preserve the eligible population. MongoDB filters had to match the real data shape. Lock release had to preserve another client's ownership. Different systems, but the same engineering habit: explain exactly what must remain true, then make the implementation enforce it.
