# Teaching a taxi fare model what a New York trip looks like

A taxi fare looks like a number attached to a trip. Predicting it made me think much more carefully about what a trip actually contains: distance, direction, time of day, the neighborhood at either end, and whether an airport changes the pricing pattern.

For this cloud ML project, the model training framework was supplied. My main contribution was deciding what information to give it. The assignment then expanded toward a service that could hear a travel question, identify the route, predict a fare, and speak a response. The feature-engineering notebooks are the strongest surviving implementation evidence, so that is where this story starts.

## Cleaning data without losing the passenger

I began with exploratory analysis of the New York taxi data: inspecting pickup locations, decomposing timestamps, and looking at the extreme fares. The cleaning step needed to respect an easily missed contract. A training row could be rejected; a test row still needed exactly one prediction in its original position.

I used fixed plausibility limits rather than fitting preprocessing state separately on each split. For training, I removed fares outside $2.50–$79.66, passenger counts outside 1–6, and coordinates outside the selected New York bounding box: longitude −74.3 to −72.9 and latitude 40.5 to 41.0. Those are choices from this dataset and assignment, not universal rules for taxi journeys.

For test inputs, I clipped the available input fields to the same bounds instead of dropping rows. Test data does not supply the fare I am trying to predict. This distinction preserved both the number of predictions and their correspondence with the original requests.

:::diagram ml-cleaning

The important property was **a stable input-output contract**. A cleaner-looking evaluation dataset would mean little if the preprocessing silently removed the trip someone had asked about.

## Giving the model a sense of geography

Raw coordinates contain location, but they do not directly describe a journey. I added vectorized haversine distance, signed and absolute coordinate differences, and bearing. I also calculated a Manhattan-style distance by adding separate latitude-only and longitude-only legs.

That second distance was a proxy for the street grid, not a routed driving distance. It gave the tree model another way to distinguish trips that look similar as straight lines but differ in their movement across the city. Computing these features with NumPy kept the transformation expressed as array operations rather than a Python loop over every ride.

Airport trips deserved their own features. I measured the distance from both endpoints to JFK, LaGuardia, Newark, and Midtown, then added indicators for an endpoint falling within two kilometers of an airport. An additional flag captured whether either end was near an airport. These features exposed a pricing pattern that ordinary trip distance could miss.

I rounded coordinates to three decimal places as another representation of location. Those coarse bins gave the model neighborhood-scale distinctions alongside the continuous coordinates.

## Making time continuous at midnight

I extracted year, month, day, hour, and weekday, then added rush-hour and weekend flags. A year offset represented the passage of time across the 2009–2015 data.

Hour of day also has a circular structure. Eleven at night is close to midnight, even though the integer values 23 and 0 are far apart. I encoded hour and weekday with sine and cosine pairs so the representation included that continuity.

I evaluated the features with five-fold cross-validation using `XGBRegressor(objective='reg:squarederror')` and inspected feature importance after each round. The supplied log does not include a final RMSE or a measured improvement for each feature family, so I do not attach a score to these choices. The concrete result is the completed preprocessing and evaluation work, including the prediction CSV.

## From a notebook to an application

The later stages connected the model to managed services. My build log records a Vertex AI HyperTune study with 15 trials and three running in parallel, reporting the `nyc_fare` metric for minimization. The trainer package came from Cloud Storage.

The application was organized as a Flask service for App Engine, with separate routes for speech recognition, entity extraction, directions, prediction, and speech synthesis. The combined fare route joined those stages. Keeping individual endpoints made it possible to reason about where a request failed instead of treating the entire chain as one opaque operation.

:::diagram ml-service

The assistant extension added retrieval over a seventeen-document collection of Manhattan landmarks and event pages. The logged design used Vertex AI embeddings, a Gemini prompt, and a LangGraph state graph with a tool node to choose between retrieved information and a fare calculation.

There is an evidence boundary here: these later tasks were developed on the GCP workspace, while the retained local App Engine and RAG files are largely scaffolding with unfinished markers. I can explain the architecture recorded in the build log; that local copy does not independently establish a complete, working assistant today.

## What I took away

The most useful work happened before model serving. Preserving test rows, making geography explicit, and representing time sensibly were small decisions with consequences for the entire application.

The broader project also showed me why an ML service needs clear boundaries. A prediction model, a directions API, and a retrieval assistant solve different problems. Giving each stage an explicit responsibility makes the final experience easier to understand, evaluate, and debug.
