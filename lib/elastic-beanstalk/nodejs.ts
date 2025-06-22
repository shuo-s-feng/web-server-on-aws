import { Construct } from "constructs";
import {
  BaseElasticBeanstalkStack,
  BaseElasticBeanstalkStackProps,
} from "./base";

export interface NodeJsElasticBeanstalkStackProps
  extends BaseElasticBeanstalkStackProps {}

export class NodeJsElasticBeanstalkStack extends BaseElasticBeanstalkStack {
  constructor(
    scope: Construct,
    id: string,
    props: NodeJsElasticBeanstalkStackProps
  ) {
    super(scope, id, props);
  }
}
