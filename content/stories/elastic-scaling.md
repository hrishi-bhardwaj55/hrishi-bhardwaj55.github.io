# Teaching an AWS fleet when to grow

Adding servers is straightforward. Deciding when to add them, waiting for them to become useful, and removing them without wasting capacity is the harder problem. This project let me implement that decision process twice: first as a Java controller talking to AWS APIs, then as a managed Auto Scaling Group.

The workload compressed a day of changing demand into minutes. A complete test took roughly forty minutes, so even a small policy adjustment had a meaningful feedback cost. I could not afford to treat every disappointing run as a reason to change several settings at once.

## Build the control loop before the policy

The first task started with a load generator and one web-service instance created from supplied AMIs. My work was the orchestration around those images. The target was to reach 50 requests per second within thirty minutes by adding capacity programmatically.

I split the Java implementation into wrappers for EC2, load balancing, CloudWatch, and Auto Scaling. A separate API layer handled the load generator's HTTP conversation, while a resource-state object tracked what the program had created. Configuration lived in JSON rather than being embedded in the controller.

This separation kept two different kinds of logic apart. AWS resource creation needed readiness checks and identifiers. The load test needed registration, progress polling, and a definite completion signal. Blending those concerns would have made a failed request difficult to diagnose.

A launch-spacing rule required at least 100 seconds between new instances. I tracked `lastLaunchTime` and checked it in a one-second polling loop. For EC2 readiness, I used the SDK's waiter instead of assuming that a fixed pause was long enough.

:::diagram elastic-scaling-control-loop

There was a second, subtler stopping condition. Reaching the throughput target did not mean the test had finished writing its final log. The controller had to wait for the explicit completion check before terminating resources. **A performance milestone and an operation's completion are different events.** Treating them as interchangeable could destroy the evidence I needed to evaluate the run.

## Move the mechanism into managed infrastructure

The next version used an Application Load Balancer, a target group, a launch template, and an Auto Scaling Group. CloudWatch alarms invoked separate scale-out and scale-in policies. Health checks were part of the workload because a service instance would deliberately be killed during the test.

The objective combined service throughput with instance-hours. Leaving a large fleet running throughout the test might help at the peak but waste capacity during quieter periods. I needed a policy that followed demand closely enough to serve requests without paying for the maximum all day.

My recorded configuration used a fleet range of one to five instances, two-instance scaling adjustments, a 60% CPU scale-out threshold, and a 40% scale-in threshold. Scale-out required three evaluation periods; scale-in required four. Those different thresholds created a band in which the fleet could stay put instead of reversing direction after a small fluctuation.

The configuration also recorded separate cooldowns—50 seconds for scale-out and 30 for scale-in—and a 180-second health-check grace period. Those settings represented different concerns: spacing scaling actions and allowing new instances time to start. A grace period gives startup room; it does not guarantee that a service will become healthy.

## Check what a configuration value really means

Reviewing this build revealed an important correction. The saved configuration specifies ten-second alarm periods, and the original log attributes that to EC2 detailed monitoring. AWS documents detailed monitoring for these EC2 metrics at **one-minute granularity**, so enabling it alone does not establish a ten-second CPU signal. [AWS EC2 metric documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html).

CloudWatch supports shorter alarm periods for suitable high-resolution metrics, but specifying a short period does not manufacture more frequent samples. I therefore treat the ten-second value as a recorded configuration choice, not proof that the controller observed fresh EC2 CPU measurements every ten seconds. [CloudWatch alarm API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html).

That distinction matters more than preserving an attractive tuning story. A policy's apparent responsiveness depends on the data arriving beneath it, as well as its thresholds, evaluation window, startup time, and cooldowns.

:::diagram elastic-scaling-timing

## Make the experiment repeatable

The build log records eighteen dated load-generator logs, roughly twelve hours of test runs. That is evidence of iteration, although it is not a substitute for a final achieved-throughput table. The 50 RPS goal, managed-test throughput requirements, and instance-hour ceiling remain targets here; I do not present them as verified scores.

I also reproduced the architecture in Terraform, using the same policy constants as the imperative version. That exercise was validated with `terraform plan`, so its evidence is a declarative description rather than an additional deployment benchmark.

The most useful result was learning to inspect the whole feedback loop. A threshold is only one decision inside it. Provisioning delays, metric resolution, workload changes, and shutdown timing can each dominate the outcome. Building both versions made those boundaries visible—and gave me a more precise way to explain what my automation actually knew before it acted.
