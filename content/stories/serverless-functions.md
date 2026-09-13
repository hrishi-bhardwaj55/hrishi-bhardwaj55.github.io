# Turning one video upload into previews and searchable tags

The starting point was a media application called CloudTube. A user uploads a video; the system needs to produce thumbnails, create a GIF preview, and make the video discoverable through image tags. Uploads arrive unevenly, so keeping a dedicated worker running all the time felt like the wrong unit of infrastructure for the exercise.

I built the processing around storage events and Python functions. The visible result was a set of media outputs and search documents, but most of the interesting work lived between those steps: filtering the right events, handling temporary files, and slowing down when an external API rejected a burst.

## Learning three ways to deploy a function

The project began with small functions on three clouds. I implemented Fibonacci on Azure Functions, a power-set generator on Google Cloud Run functions, and a CIDR analyzer on AWS Lambda.

The algorithms were intentionally small. Fibonacci used iteration, and the power set grew by adding each new element to the subsets already accumulated. For the network calculation, I used Python's standard library: `ipaddress.ip_network(sig, strict=False)`. The flag mattered because the input could be a host address with a prefix rather than the network's first address.

That exercise kept application complexity low while making the platform differences visible: packaging, invocation, and authentication. The larger media pipeline then concentrated on Azure.

## Let storage events describe the work

I separated uploaded videos, generated thumbnails, and GIF previews into Blob Storage containers. An Event Grid subscription delivered video-created events to `generateThumbnail`, which downloaded the video, extracted one frame per second with ffmpeg, and uploaded numbered PNG files.

A second handler, `generatePreview`, sampled one frame every two seconds to produce a GIF. A third, `labelThumbnail`, reacted to each new thumbnail, requested tags from Azure AI Vision, and wrote the resulting document to Azure AI Search.

:::diagram serverless-flow

The subscriptions were part of the application logic. A container-prefix filter restricted the thumbnail generator to original video uploads. Without that boundary, the files it wrote could trigger more work through the wrong handler.

The assignment specified a single delivery attempt for the video-processing subscription because processing could outlast its delivery window. I treated that as a constraint of this implementation, not a general answer to reliable event delivery. Preventing duplicate work and recovering failed jobs are separate problems; a low retry count alone cannot solve both.

## The filesystem still has a lifecycle

The Python v2 function app held three `@app.event_grid_trigger` handlers with shared helpers. Some of the most useful code had nothing to do with transforming a video.

The deployment share was read-only in the environment described in my log. The `prepareFFMpeg()` helper copied the bundled binary to a UUID-suffixed location under `/tmp` and made that copy executable. I used a `chmod` subprocess after encountering a `Not implemented` error from `os.chmod` in the project environment.

Function instances could also be reused. A new invocation did not necessarily mean an empty working directory. My `resetFolder()` helper cleared the per-video workspace so frames left behind by an earlier run would not be uploaded with the current result.

Finally, `extractBlobName()` decoded the blob URL and split it using the container prefix. It recovered the storage object name from the URL rather than assuming that an event subject could be passed straight into a download call.

These details changed how I thought about serverless execution. I was no longer managing the server, but I still needed to understand which parts of its state survived and which paths the function could write.

:::diagram serverless-boundaries

## A video can turn into a burst of API calls

Thumbnail generation multiplies work. One upload can produce many images, and each image can become a request to AI Vision. The course configuration specified a ten-transactions-per-second limit for the selected tier, so the downstream service could reject a burst even when the function itself was running normally.

I added handling for HTTP 429 responses, retrying up to ten times with a two-second wait. That gave rate-limited calls another opportunity to complete. It was bounded retry behavior, not a guarantee that every frame would eventually be labeled.

For search ingestion, I sent a compact document containing `id` and `tags` through the REST indexing endpoint with an explicit API version. The ID came from the thumbnail name with its extension removed. Using the REST call kept the function's dependency list small.

Account names, endpoints, and credentials came from environment settings. The function code could be packaged without embedding account secrets.

## What the implementation proves

The retained build log describes the event handlers, ffmpeg preparation, workspace cleanup, blob-name parsing, and bounded Vision retry loop. It does not report end-to-end throughput, a failure-recovery test, or a production delivery guarantee. The assignment also required a call-volume alert; that requirement should not be mistaken for evidence of a measured operating history.

What I can explain concretely is how I broke the media workflow into observable steps and addressed the runtime behavior each step depended on. A thumbnail handler could focus on files and ffmpeg. A labeling handler could focus on API limits and indexing. Event filters connected those responsibilities.

The lesson I carried forward was that smaller deployment units do not automatically create a simpler system. They make the boundaries more visible. In this project, those boundaries—storage events, temporary state, and downstream capacity—were where the engineering decisions mattered most.
