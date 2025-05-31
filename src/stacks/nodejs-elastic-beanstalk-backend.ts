/**
 * Stack for deploying a Node.js application on AWS Elastic Beanstalk.
 * This stack sets up all necessary AWS resources including:
 * - Elastic Beanstalk application and environment
 * - IAM roles and instance profiles
 * - S3 assets for source code
 * - Optional HTTPS configuration
 * - Optional logging and monitoring setup
 * - Optional custom domain configuration
 */
import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import {
  CfnApplication,
  CfnApplicationVersion,
  CfnEnvironment,
} from "aws-cdk-lib/aws-elasticbeanstalk";
import {
  Role,
  ServicePrincipal,
  ManagedPolicy,
  CfnInstanceProfile,
} from "aws-cdk-lib/aws-iam";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import {
  ARecord,
  AliasRecordTargetConfig,
  HostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";

/**
 * Properties for configuring the Node.js Elastic Beanstalk backend stack
 */
export interface NodeJSElasticBeanstalkBackendStackProps extends StackProps {
  /** Name of the Elastic Beanstalk application */
  applicationName: string;
  /** Name of the environment (e.g., 'staging', 'prod') */
  environmentName: string;
  /** Optional custom domain name for the application */
  domainName?: string;
  /** ARN of the SSL certificate for HTTPS support */
  domainCertificateArn?: string;
  /** Local path to the Node.js application source code */
  sourcePath: string;
  /** EC2 instance type for the Elastic Beanstalk environment */
  ec2InstanceType?: string;
  /** Minimum number of EC2 instances to maintain */
  minimumInstanceCount?: number;
  /** Maximum number of EC2 instances to maintain */
  maximumInstanceCount?: number;
  /** Configuration for various logging options */
  logging?: {
    /** Enable streaming of web server logs to CloudWatch */
    enableWebServerLogStreaming?: boolean;
    /** Enable streaming of health event logs to CloudWatch */
    enableHealthEventLogStreaming?: boolean;
    /** Enable enhanced health reporting and monitoring */
    enableHealthReporting?: boolean;
  };
}

export class NodeJSElasticBeanstalkBackendStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: NodeJSElasticBeanstalkBackendStackProps
  ) {
    super(scope, id, props);
    const {
      applicationName,
      environmentName,
      domainName,
      domainCertificateArn,
      sourcePath,
      ec2InstanceType = "t3.small",
      minimumInstanceCount = 1,
      maximumInstanceCount = 2,
      logging = {
        enableWebServerLogStreaming: false,
        enableHealthEventLogStreaming: false,
        enableHealthReporting: false,
      },
    } = props;

    // Create an S3 asset to store and version the Node.js application source code
    // This asset will be used by Elastic Beanstalk to deploy the application
    const nodeJSBackendSourceAsset = new Asset(
      this,
      "NodeJSBackendSourceAsset",
      {
        path: sourcePath,
      }
    );

    // Create an IAM role that will be assumed by EC2 instances in the Elastic Beanstalk environment
    // This role grants necessary permissions for the application to function properly
    const elasticBeanstalkRole = new Role(this, "ElasticBeanstalkRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
    });

    // Attach required AWS managed policies to the IAM role
    // These policies provide permissions for:
    // - Web tier operations (handling HTTP/HTTPS traffic)
    // - Worker tier operations (background tasks)
    // - Docker container operations (if using multi-container setup)
    // - General Elastic Beanstalk administration
    elasticBeanstalkRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AWSElasticBeanstalkWebTier")
    );
    elasticBeanstalkRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AWSElasticBeanstalkWorkerTier")
    );
    elasticBeanstalkRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AWSElasticBeanstalkMulticontainerDocker"
      )
    );
    elasticBeanstalkRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AdministratorAccess-AWSElasticBeanstalk"
      )
    );

    // Create an instance profile that associates the IAM role with EC2 instances
    // This is required for Elastic Beanstalk to launch instances with the correct permissions
    const elasticBeanstalkInstanceProfile = new CfnInstanceProfile(
      this,
      "ElasticBeanstalkInstanceProfile",
      {
        roles: [elasticBeanstalkRole.roleName],
      }
    );

    // Create the Elastic Beanstalk application
    // This is the top-level container for all environments and versions
    const nodeJSAppplication = new CfnApplication(this, "NodeJSApplication", {
      applicationName,
    });

    // Create a new application version from the source code
    // Each deployment will create a new version, allowing for rollbacks if needed
    const applicationVersion = new CfnApplicationVersion(this, "AppVersion", {
      applicationName: nodeJSAppplication.applicationName!,
      sourceBundle: {
        s3Bucket: nodeJSBackendSourceAsset.s3BucketName,
        s3Key: nodeJSBackendSourceAsset.s3ObjectKey,
      },
    });

    // Configure HTTPS settings for the load balancer
    // These settings enable SSL/TLS termination at the load balancer level
    const optionSettingsForHttps: Array<CfnEnvironment.OptionSettingProperty> =
      [
        // Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html#command-options-general-elbv2-listener
        {
          namespace: "aws:elbv2:listener:443",
          optionName: "ListenerEnabled",
          value: "true",
        },
        {
          namespace: "aws:elbv2:listener:443",
          optionName: "Protocol",
          value: "HTTPS",
        },
        {
          namespace: "aws:elbv2:listener:443",
          optionName: "SSLCertificateArns",
          value: domainCertificateArn,
        },
      ];

    // Configure CloudWatch logging for web server logs
    // This enables streaming of application logs to CloudWatch for monitoring and debugging
    const optionSettingsForWebServerLogStreaming: Array<CfnEnvironment.OptionSettingProperty> =
      [
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs",
          optionName: "StreamLogs",
          value: "true",
        },
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs",
          optionName: "RetentionInDays",
          value: "30",
        },
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs",
          optionName: "DeleteOnTerminate",
          value: "false",
        },
      ];

    // Configure CloudWatch logging for health events
    // This enables monitoring of instance health and application status
    const optionSettingsForHealthEventLogStreaming: Array<CfnEnvironment.OptionSettingProperty> =
      [
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs:health",
          optionName: "HealthStreamingEnabled",
          value: "true",
        },
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs:health",
          optionName: "RetentionInDays",
          value: "30",
        },
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs:health",
          optionName: "DeleteOnTerminate",
          value: "false",
        },
      ];

    // Configure enhanced health reporting
    // This enables detailed monitoring of various metrics including:
    // - Application latency
    // - Request counts
    // - Instance health
    // - System metrics (CPU, memory, etc.)
    const optionSettingsForHealthReporting: Array<CfnEnvironment.OptionSettingProperty> =
      [
        {
          namespace: "aws:elasticbeanstalk:healthreporting:system",
          optionName: "SystemType",
          value: "enhanced",
        },
        {
          namespace: "aws:elasticbeanstalk:healthreporting:system",
          optionName: "ConfigDocument",
          // Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/health-enhanced-cloudwatch.html#health-enhanced-cloudwatch-configdocument
          value: JSON.stringify({
            CloudWatchMetrics: {
              Environment: {
                // API Latencies
                // ApplicationLatencyP10: 60,
                // ApplicationLatencyP50: 60,
                // ApplicationLatencyP75: 60,
                // ApplicationLatencyP85: 60,
                ApplicationLatencyP90: 60,
                ApplicationLatencyP95: 60,
                ApplicationLatencyP99: 60,
                // 'ApplicationLatencyP99.9': 60,

                // API Request Count
                // ApplicationRequests2xx: 60,
                // ApplicationRequests3xx: 60,
                ApplicationRequests4xx: 60,
                ApplicationRequests5xx: 60,
                ApplicationRequestsTotal: 60,

                // Instance statuses
                InstancesNoData: 60,
                InstancesUnknown: 60,
                InstancesPending: 60,
                InstancesInfo: 60,
                InstancesWarning: 60,
                InstancesSevere: 60,
                InstancesDegraded: 60,
                InstancesOk: 60,
              },
              Instance: {
                // API Latencies
                // ApplicationLatencyP10: 60,
                // ApplicationLatencyP50: 60,
                // ApplicationLatencyP75: 60,
                // ApplicationLatencyP85: 60,
                ApplicationLatencyP90: 60,
                ApplicationLatencyP95: 60,
                ApplicationLatencyP99: 60,
                // 'ApplicationLatencyP99.9': 60,

                // API Request Count
                // ApplicationRequests2xx: 60,
                // ApplicationRequests3xx: 60,
                ApplicationRequests4xx: 60,
                ApplicationRequests5xx: 60,
                ApplicationRequestsTotal: 60,

                // Instance health event count
                InstanceHealth: 60,

                // Instance load balancing
                LoadAverage1min: 60,
                LoadAverage5min: 60,

                // CPU
                CPUUser: 60,
                CPUIdle: 60,
                CPUIrq: 60,
                CPUNice: 60,
                CPUIowait: 60,
                CPUSystem: 60,
                CPUSoftirq: 60,

                // File system
                RootFilesystemUtil: 60,
              },
            },
            // Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/health-enhanced-rules.html#health-enhanced-rules.configdocument
            Rules: {
              Environment: {
                Application: {
                  ApplicationRequests4xx: {
                    Enabled: false,
                  },
                },
                ELB: {
                  ELBRequests4xx: {
                    Enabled: false,
                  },
                },
              },
            },
            Version: 1,
          }),
        },
      ];

    // Create the Elastic Beanstalk environment
    // This is where the application actually runs, with all the configured settings
    const nodeJSEnvironment = new CfnEnvironment(this, "NodeJSEnvironment", {
      applicationName: nodeJSAppplication.applicationName!,
      environmentName: nodeJSAppplication.applicationName!,
      // Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.python
      solutionStackName: "64bit Amazon Linux 2023 v6.5.2 running Node.js 22",
      optionSettings: [
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "InstanceType",
          value: ec2InstanceType,
        },
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: elasticBeanstalkInstanceProfile.attrArn,
        },
        {
          namespace: "aws:elasticbeanstalk:environment",
          optionName: "LoadBalancerType",
          value: "application",
        },
        {
          namespace: "aws:elbv2:loadbalancer",
          optionName: "IdleTimeout",
          // 300 seconds for request timeout
          value: "300",
        },
        {
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: "Env",
          value: environmentName,
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MinSize",
          value: minimumInstanceCount.toString(),
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MaxSize",
          value: maximumInstanceCount.toString(),
        },
        ...(domainName && domainCertificateArn ? optionSettingsForHttps : []),
        ...(logging.enableWebServerLogStreaming
          ? optionSettingsForWebServerLogStreaming
          : []),
        ...(logging.enableHealthEventLogStreaming
          ? optionSettingsForHealthEventLogStreaming
          : []),
        ...(logging.enableHealthReporting
          ? optionSettingsForHealthReporting
          : []),
      ],
      // Let the EB environment consume the latest version of the NodeJS application
      versionLabel: applicationVersion.ref,
    });

    // Set up dependencies to ensure proper deployment order
    // The application must exist before the environment and version can be created
    nodeJSEnvironment.addDependency(nodeJSAppplication);
    applicationVersion.addDependency(nodeJSAppplication);

    // If a custom domain is provided, set up DNS routing
    if (domainName && domainCertificateArn) {
      // Look up the hosted zone for the custom domain
      const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
        domainName,
      });

      // Create an A record to route traffic from the custom domain to the Elastic Beanstalk environment
      // This uses an alias record to point to the load balancer
      new ARecord(this, "ARecord", {
        recordName: domainName,
        // Due to tech limitations, we can only auto direct traffic to the load balancer of the EB instance
        target: RecordTarget.fromAlias({
          bind: (): AliasRecordTargetConfig => ({
            dnsName: nodeJSEnvironment.attrEndpointUrl,
            // AWS official hosted zone id for classic load balancers in region us-east-1
            // Reference: https://docs.aws.amazon.com/general/latest/gr/rande.html#elasticbeanstalk_region
            hostedZoneId: "Z35SXDOTRQ7X7K",
          }),
        }),
        zone: hostedZone,
      });
    }
  }
}
