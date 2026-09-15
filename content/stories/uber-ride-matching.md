# Uber Ride Matching: making the next event count

A driver location by itself does not tell a ride-booking system whether that driver can accept a trip. The driver may have just left the block, been assigned to another rider, or completed a ride somewhere else. I built this Uber-style matching backend to make those changes part of the computation, one event at a time.

The coursework scenario was called NYCabs. I used Java 11, Kafka 2.8 and Samza 1.8 on an AWS EMR cluster to process supplied event traces at more than 10,000 events per second. The backend joined driver availability, ride requests and advertising decisions over those traces.

## The partition key was part of the algorithm

My producer read each trace record, inspected its event type and routed it to either the driver-location topic or the general event topic. Both used five partitions, with `blockId % 5` deciding the destination.

That rule had a purpose beyond distributing load. A ride request could only match drivers in the rider's own city block. Events for a block therefore needed to reach the processor holding that block's driver state. Choosing an unrelated key would scatter the information required to make one decision.

The same split carried the volume. With blocks spread across five partitions, no single processor owned enough of the city to fall behind the stream at that rate.

I developed two producer variants because the later advertising task changed the routing needs. Ride requests still belonged to one block, while rider-profile updates needed to reach every partition that might later handle that rider. The second producer broadcast those updates while continuing to partition the ride traffic.

:::diagram uber-event-routing

## Availability is a state machine

The driver matcher kept a fault-tolerant Samza key-value store keyed by block. Within each block, it stored each driver's location, status, rating, salary and gender as required by the coursework's matching model.

I treated `ENTERING_BLOCK` as the authoritative event that registered or refreshed a driver's full state. A `DRIVER_LOCATION` update only changed coordinates for a driver already known to the processor. A location report alone was not enough to create an available driver.

`LEAVING_BLOCK` removed the driver from that block's available state. A `RIDE_REQUEST` scored eligible drivers, emitted the chosen client and driver IDs to `match-stream`, and removed the winner from the available set. On `RIDE_COMPLETE`, the task averaged the previous rating with the new rider rating and registered the driver in the block where the ride ended.

I kept those transitions together in one switch, with the scoring function separate. That made it possible to read the event handling as a lifecycle instead of reconstructing it from unrelated methods.

:::diagram uber-driver-lifecycle

## Keeping the score easy to inspect

The matching formula was specified by the course: forty percent distance, ten percent gender preference, thirty percent normalized rating and twenty percent inverse salary. I implemented those weights directly so the code could be checked against the supplied rules.

The interesting engineering work was around the formula. Only available drivers in the same block were candidates, and the selected driver had to leave the set before another request was processed against that state. A sophisticated score would not help if the candidate set was stale.

State also needed a recovery path. I used Samza's fault-tolerant store rather than a task-local map as the system of record. Samza's changelog mechanism supports restoring local state when a task moves or restarts. That is an architectural capability of the chosen storage mechanism; I do not have a measured recovery-time result to attach to this project.

## Joining a ride request with information that changes more slowly

The advertising stage combined the event stream with two static datasets: rider profiles and New York business listings. I loaded that information into the store at startup and built six category-tag sets during initialization.

A business mapped to one tag, while a rider's status could produce several. I included an `others` fallback on both sides so an unmatched category still had a defined path. Interest events updated the rider's stored interest only when the browsing duration exceeded five minutes, following the supplied rule.

On a ride request, the job selected businesses with compatible tags and applied the prescribed rating, interest, affordability and distance factors. The distance calculation used the exact miles-based formula pinned by the reference. An alternative implementation could change which side of a threshold a business landed on, even if it looked geographically reasonable.

This stage made the broadcast decision visible: a ride request should encounter the rider information held by its own partition, rather than depend on a profile update having happened to visit that partition earlier.

## Three jobs I could reason about separately

I packaged `driver-match`, `ad-match` and `ad-price` as independent Samza projects. Each had its own job properties, serialization configuration and submission script to package the code, upload it to HDFS and submit it through YARN. The final transformation consumed ad-click events partitioned by user and applied the coursework's click-dependent revenue split.

My main takeaway was that streaming correctness starts before the score function. The producer decides where knowledge lives. The state transitions decide which knowledge is current. The storage configuration decides whether that knowledge can be recovered. Making those three choices explicit was the most valuable part of building this pipeline.
