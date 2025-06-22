import path from "path";
import { env } from "process";
import { App } from "aws-cdk-lib";
import { getBaseEnvVariables } from "../utils/environment";
import {
  DjangoElasticBeanstalkStack,
  DjangoElasticBeanstalkStackProps,
  DockerElasticBeanstalkStack,
  DockerElasticBeanstalkStackProps,
  NodeJsElasticBeanstalkStack,
  NodeJsElasticBeanstalkStackProps,
} from "../lib/elastic-beanstalk";

const envVars = getBaseEnvVariables();
const framework = envVars.framework;
const appName = env.BACKEND_APP_NAME;
const solutionStackName = env.BACKEND_SOLUTION_STACK_NAME;
const domainName = env.BACKEND_DOMAIN_NAME ?? "";
const domainCertificateArn = env.BACKEND_DOMAIN_CERT_ARN ?? "";
const backendSourcePath = env.BACKEND_SOURCE_PATH;
const staticFilesPath = env.BACKEND_STATIC_FILES_PATH ?? "";
const ec2InstanceType = env.BACKEND_EC2_INSTANCE_TYPE ?? "t3.small";
const minimumInstanceCount = parseInt(env.BACKEND_MIN_INSTANCES ?? "1", 10);
const maximumInstanceCount = parseInt(env.BACKEND_MAX_INSTANCES ?? "2", 10);
const looseHealthCheck = env.BACKEND_LOOSE_HEALTH_CHECK === "true";
const enableWebServerLogStreaming =
  env.BACKEND_ENABLE_WEB_SERVER_LOGS === "true";
const enableHealthEventLogStreaming =
  env.BACKEND_ENABLE_HEALTH_EVENT_LOGS === "true";
const enableHealthReporting = env.BACKEND_ENABLE_HEALTH_REPORTING === "true";

if (!appName || !solutionStackName || !backendSourcePath) {
  throw new Error(
    "BACKEND_APP_NAME, BACKEND_SOLUTION_STACK_NAME and BACKEND_SOURCE_PATH must be set"
  );
}

// Django
const djangoWsgiPath = env.DJANGO_BACKEND_WSGI_PATH;

// Docker
const dockerContainerPort = env.DOCKER_BACKEND_CONTAINER_PORT;

const camelCasedStage = envVars.stage[0].toUpperCase() + envVars.stage.slice(1);
const backendStackName = `${appName}-${camelCasedStage}`;
const sourcePath = path.resolve(process.cwd(), backendSourcePath);

const app = new App();

if (appName && envVars.stage && envVars.account && envVars.region) {
  const config: Record<string, any> = {
    applicationName: backendStackName,
    environmentName: envVars.stage,
    solutionStackName,
    domainName,
    domainCertificateArn,
    sourcePath,
    staticFilesPath,
    ec2InstanceType,
    minimumInstanceCount,
    maximumInstanceCount,
    looseHealthCheck,
    logging: {
      enableWebServerLogStreaming,
      enableHealthEventLogStreaming,
      enableHealthReporting,
    },
    env: {
      account: envVars.account,
      region: envVars.region,
    },
  };

  console.info(`Deploying ${framework} backend with config`, config, "\n");

  if (framework === "nodejs") {
    new NodeJsElasticBeanstalkStack(
      app,
      backendStackName,
      config as NodeJsElasticBeanstalkStackProps
    );
  } else if (framework === "django") {
    if (!djangoWsgiPath) {
      throw new Error("DJANGO_BACKEND_WSGI_PATH must be set");
    }

    config.wsgiPath = djangoWsgiPath;

    new DjangoElasticBeanstalkStack(
      app,
      backendStackName,
      config as DjangoElasticBeanstalkStackProps
    );
  } else if (framework === "docker") {
    if (!dockerContainerPort) {
      throw new Error("DOCKER_BACKEND_CONTAINER_PORT must be set");
    }

    config.containerPort = dockerContainerPort;

    new DockerElasticBeanstalkStack(
      app,
      backendStackName,
      config as DockerElasticBeanstalkStackProps
    );
  } else {
    throw new Error(`Unsupported framework: ${framework}`);
  }
} else {
  console.error(
    `Missing required environment variables to deploy ${backendStackName}`
  );
}
