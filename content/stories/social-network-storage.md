# Building one timeline across three databases

A social timeline looks like one feature until you follow its data. A profile belongs to an account. The people that account follows form a graph. Their comments are documents, with parent and grandparent comments providing the context. In this project, I built the backend that combined those pieces into one JSON response.

The course called the application RedditBook. Its dataset contained approximately 2.6 million users, 16 million follow relationships and 37.5 million Reddit comments. My implementation used Java servlets with Undertow and Gson, backed by managed MySQL on Azure, Neo4j and MongoDB. The challenge was keeping the boundaries understandable as one request began to depend on all three stores.

## Giving each database a specific job

MySQL held account and profile information. Neo4j represented directed `FOLLOWS` relationships. MongoDB stored the comments. This division was part of the project brief, but implementing it made the tradeoff concrete: each database offered a useful model for its own data, while the application took responsibility for composing the answer.

The initial data-loading requirements also differed. The graph task called for `neo4j-admin import` rather than transactional CSV ingestion at this scale. The comment task called for an index on `uid`, because looking up one user's comments should not require scanning the entire collection. Those requirements tied the storage choice to how data enters the system and how requests retrieve it.

:::diagram social-store-responsibilities

## Putting query rules in one place

I built a data accessor for each storage tier instead of placing database logic directly inside every servlet. The most useful example was MongoDB: a shared `getComments(Bson filter, int limit)` method handled filtering, ordering and projection.

The profile page called that method with a single user's ID. The timeline called it with the IDs of everyone the user followed and a limit of thirty. Parent and grandparent lookups reused it with a comment ID and a limit of one. Four different needs went through one query boundary.

The shared method sorted by upvotes descending and then timestamp descending, and excluded MongoDB's generated `_id` field from the response. Keeping those rules together mattered more than saving lines of code. If each servlet had its own version, a change to ordering or response shape could easily reach one endpoint and miss another.

I treated the graph similarly. `getFollowers` served the profile panel, while `getFollowees` supplied the timeline's author list. They shared the Bolt driver and session handling, and Cypher performed the name ordering. Naming both directions explicitly prevented an easy mistake: showing comments from people who follow me instead of people I follow.

## Following a request through the system

Building the timeline started with the user's profile and graph relationships. The followee IDs became a MongoDB filter, and the database returned the thirty highest-ranked comments across that set. I then followed each comment's `parent_id` to its parent and repeated the lookup for its grandparent before nesting the results.

That final step was about making the response useful. A popular reply without its context can be difficult to understand; the API needed to carry enough of the conversation for a client to present it.

It also exposed a cost of composing data at request time. The top thirty comments were not the end of the work: context could require additional lookups. Centralizing those lookups made the path easier to inspect, although it did not make the extra database work disappear. Batching those context reads would be a sensible next experiment, not an optimization I claim to have measured here.

:::diagram social-timeline-request

## A cache with an observable admission rule

The caching task deliberately ruled out storing every response. Only users with more than three hundred followers were eligible. I kept that policy in a thin servlet layer around the existing timeline logic.

On a cache hit, the servlet returned the saved response immediately. On a miss, it built the same timeline as before, then counted the followers already fetched for the response. Only an eligible user caused a cache write. Reusing that data avoided a separate graph lookup just to decide whether caching was allowed.

I also added a `CacheHit` response header. That small diagnostic made the policy visible from a request: I could distinguish an actual hit from an uncached response that happened to be fast. It made checking the hot and cold paths much more direct than inferring them from latency.

The course set a 300 ms requirement for cached responses and allowed longer for uncached ones. My build log does not include an achieved latency distribution, so those numbers describe the test contract rather than a performance claim.

## What this changed about my backend design

I kept database credentials in environment variables and used the storage accessors to concentrate connection handling and response rules. The result was an implementation whose request path I could explain from the HTTP boundary down to each query.

The larger lesson was that using three databases creates work between them. Choosing a graph store does not solve timeline assembly, and adding a cache does not define who deserves an entry. Those decisions still belong to the application. Clear accessors, explicit graph direction and a visible cache policy were the parts that made this backend manageable.
