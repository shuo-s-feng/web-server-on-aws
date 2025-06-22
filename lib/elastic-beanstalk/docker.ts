import { Construct } from "constructs";
import {
  BaseElasticBeanstalkStack,
  BaseElasticBeanstalkStackProps,
} from "./base";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

export interface DockerElasticBeanstalkStackProps
  extends BaseElasticBeanstalkStackProps {
  containerPort: number;
}

export class DockerElasticBeanstalkStack extends BaseElasticBeanstalkStack {
  constructor(
    scope: Construct,
    id: string,
    props: DockerElasticBeanstalkStackProps
  ) {
    super(scope, id, {
      ...props,
      optionSettings: [
        ...(props.optionSettings ?? []),
        {
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: "PORT",
          value: props.containerPort.toString(),
        },
      ],
    });

    // Add ECR policy for Docker image pulls
    this.elasticBeanstalkRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryReadOnly"
      )
    );

    // Add multicontainer docker policy
    this.elasticBeanstalkRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AWSElasticBeanstalkMulticontainerDocker"
      )
    );
  }
}
