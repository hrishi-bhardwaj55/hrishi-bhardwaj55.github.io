# Small cloud projects, expensive assumptions

The first project in my cloud computing semester paired two apparently unrelated jobs: investigate small AWS instances, then turn an hour of Wikipedia traffic into a clean dataset. One was about machines and the other about strings. Both turned out to ask the same question: **which assumptions will break when this runs somewhere else?**

I worked in a tightly constrained environment, with a small spending allowance and a submission process that could block the network and enforce a hard timeout. That made the unglamorous parts of engineering immediately visible. A program that depended on my laptop's locale, compiled itself during execution, or left an instance running after the experiment was incomplete.

## Start with a workspace I could rebuild

The infrastructure work began with a Terraform module for the course workspace. I parameterized the region, instance type, AMI, project tag, and SSH key name instead of scattering those choices through resource definitions. The workspace used a small EC2 instance, with the network access needed for SSH and the web exercise.

That module became useful beyond this warm-up. I reused its structure in the scaling, containers, and streaming projects later in the semester. The benefit was a consistent starting point: I could change the workload-specific inputs while keeping the basic provisioning pattern recognizable.

The benchmarking exercise compared three ARM-based EC2 sizes using CPU and random file-I/O workloads. It also introduced burst credits, which make a short benchmark more complicated than a simple ranking of instance sizes. A burstable machine has a baseline and a temporary reserve; a storage volume can have a similar distinction. The build log preserves the workload definitions, but not a final results table, so I do not attach a speedup claim to this part of the project.

## Make the data contract explicit

The Wikipedia task had a more precise output contract. The input arrived as a gzip stream containing pageview rows. I needed to retain English desktop and mobile entries, discard pages outside the allowed article set, combine counts for the same title, and produce a deterministic ranking.

Decoding was already a trap. The required Wikimedia behavior preserved stray percent signs and did not convert a plus sign into a space. Treating the title as a generic web-form field could silently change the data before any filtering happened.

I separated structural checks from title rules. Rows needed four columns and an accepted domain. Titles then passed namespace, suffix, first-letter, and special-page checks. Media files, disambiguation pages, and entries such as `Main_Page` were outside the dataset I was constructing. Each exclusion changed the meaning of the final analysis, so these were data rules rather than incidental cleanup.

:::diagram aws-foundations-pipeline

After filtering, desktop and mobile counts for a title were added together. Sorting used descending view counts and ascending title order for ties. That second key matters: equal counts should not cause a result file to change because a map happened to iterate in a different order.

## Give every rule a small testable boundary

I implemented the filter as one method per rule, followed by a composite check. Before implementing each method, I wrote positive and negative JUnit cases. A small predicate made it easier to understand what a failure meant: the problem was in a namespace decision or a suffix decision, not somewhere inside a long chain of conditions.

The coverage requirement was 100% instruction and branch coverage for the filter class. I used that requirement to think about missing inputs, especially short-circuit expressions. Testing only one accepted row and one rejected row would not establish that every operand in a compound condition had been exercised.

**Coverage was a constraint, not a substitute for choosing meaningful cases.** The tests still needed to express the input contract. The build record describes this test-first approach, although it does not include the final JaCoCo report.

:::diagram aws-foundations-reproducibility

## Make the analysis portable too

The final analysis combined shell tooling with pandas in a Jupyter notebook, accessed through an SSH tunnel. I had to carry the same discipline into those smaller scripts: explicit UTF-8, explicit newline behavior, relative paths, and no assumptions about local tool variants.

Reading directly from the compressed input kept decompression inside the pipeline. Preparing the executable before submission kept compilation out of the timed runner. These decisions made the execution model easier to explain and reproduce.

What I carried forward was a habit of treating the environment as part of the program. Terraform described where it ran; tests described which rows belonged in the dataset; deterministic output described what another machine should produce. The preserved local artifact is the Terraform module, while the filter and analysis lived on the course VM. Together, the work established the approach I used throughout the semester: make assumptions explicit before they become debugging problems.
