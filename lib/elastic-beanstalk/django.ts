import { Construct } from "constructs";
import {
  BaseElasticBeanstalkStack,
  BaseElasticBeanstalkStackProps,
} from "./base";

export interface DjangoElasticBeanstalkStackProps
  extends BaseElasticBeanstalkStackProps {
  /** Path to the WSGI file for the Django application */
  wsgiPath: string;
}

export class DjangoElasticBeanstalkStack extends BaseElasticBeanstalkStack {
  constructor(
    scope: Construct,
    id: string,
    props: DjangoElasticBeanstalkStackProps
  ) {
    super(scope, id, {
      ...props,
      optionSettings: [
        ...(props.optionSettings ?? []),
        {
          namespace: "aws:elasticbeanstalk:container:python",
          optionName: "WSGIPath",
          // Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html
          value: props.wsgiPath,
        },
      ],
    });
  }
}
