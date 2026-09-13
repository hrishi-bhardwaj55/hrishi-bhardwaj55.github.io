# One chat application, two clouds, one deployment model

WeCloud Chat started as three supplied Spring applications: login, group chat, and profile. My contribution was the path from those source trees to a deployment that spanned Google Cloud and Azure. That meant packaging, service discovery, databases, routing, scaling, and a configuration model I could still understand after adding the second cloud.

The interesting question was how much of the application definition could stay shared. Copying every manifest for each provider would have worked initially, but it would also create two places to fix every common problem. I wanted the differences to be visible without allowing them to take over the design.

## Make one service deployable first

I began with the profile service. Its Docker image built the Java application inside a Maven container and ran the resulting Spring Boot jar. The local port mapping exposed the application's port 8080 through port 8000, giving me a small, concrete deployment boundary to establish before involving a cluster.

From there, I pushed the image to Google Artifact Registry and described a GKE deployment with three replicas behind a Kubernetes service. The external service port and the container port were different, so the manifest had to express that mapping explicitly.

The next change replaced the embedded H2 database with MySQL and moved the deployment into Helm. Credentials went into a Kubernetes Secret, ordinary configuration into a ConfigMap, and configurable choices into `values.yaml`. This made the database migration an infrastructure and dependency change rather than a reason to duplicate the application definition.

## Turn the chart into an application description

As I brought login and chat into the deployment, the chart acquired a consistent set of templates for each service: deployment, service, configuration, and secrets. An ingress controller routed `/login`, `/profile`, and `/chat` to the appropriate backends through one external entry point.

Small wiring details mattered. Each service needed distinct label selectors so a request for chat could not reach a profile pod. Chat also depended on Redis pub/sub to coordinate its replicas and MySQL to retain message history. More replicas only help if the application's shared state is connected correctly.

:::diagram wecloud-chart

The values file became the most useful artifact. It described image names and tags, replica counts, ports, database hosts, and scaling settings. I could read it as a compact description of the deployment rather than search through several templates to discover which values differed.

For CPU-based autoscaling, I configured a Horizontal Pod Autoscaler per deployment, with a range of one to five replicas and a 50% utilization target. The chart included a `200m` CPU request so utilization had an explicit reference point. These are the recorded settings; the source does not include a throughput curve proving how the application scaled under load.

## Add Azure without forking the architecture

The second cloud used Azure Kubernetes Service and Azure Container Registry. I kept a shared chart and supplied environment-specific values. Helm conditions controlled which services belonged in each environment: login and profile ran on both clouds, while chat and Redis remained on Google Cloud.

This was deliberately asymmetric. The Azure values file changed the environment flag, image choices, and database service names. It did not need a separately maintained copy of every Kubernetes object.

The important connection sat inside chat's configuration. Its `profileEndpoints` list contained both a Google ingress address and an Azure ingress address, which the ConfigMap exposed as `LIST_OF_PROFILE_ENDPOINTS`. The application could therefore reach profile services across the two clusters, rather than treating them as unrelated installations.

:::diagram wecloud-placement

That placement also defines the limit of the resilience claim. Having profile capacity in two clouds gives the design another destination for those requests. It does not mean the whole application survives the loss of either cloud: chat and Redis still depend on Google Cloud. I would need separate evidence for outage behavior and cross-cloud data consistency before making broader availability claims.

## Put a common entrance in front

I described Azure Front Door in Terraform, with routes separating login/profile traffic from chat traffic and health probes for the corresponding origin groups. This brought the public routing configuration under version control alongside the cluster configuration.

Routing policy is another place where a configuration should not be mistaken for an observed outcome. The build specifies health-probe and latency settings; it does not preserve a failover experiment or prove an exact request distribution between clouds. What it does show is how the entry point and service placement fit together.

## Keep delivery claims tied to the artifacts

The project called for a pipeline that detected changed services, built and tagged images, pushed them to both registries, and deployed to both clusters. Commit-based image tags would let a running container be traced to source, while federated Azure authentication would avoid a persistent deployment credential.

My build log reports that the graded pipeline lived in a separate repository. The local `cicd.yml` still contains template placeholders, so I do not use that file as evidence of a completed delivery run.

The strongest part of this project is the deployment model itself: one chart, explicit environment differences, and readable connections between services. It taught me that adding a cloud adds relationships to manage. Making those relationships visible was the work that kept the application understandable.
