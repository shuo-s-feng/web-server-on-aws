import path from "path";
import { App } from "aws-cdk-lib";
import getEnvVariables from "../src/utils/get-env-variables";
import { DjangoElasticBeanstalkBackendStack } from "../src/stacks/django-elastic-beanstalk-backend";

const envVars = getEnvVariables();
const camelCasedStage = envVars.stage[0].toUpperCase() + envVars.stage.slice(1);
const djangoBackendStackName = `${envVars.djangoBackendAppName}-${camelCasedStage}`;
const djangoBackendSourcePath = path.resolve(
  process.cwd(),
  envVars.djangoBackendSourcePath
);

const app = new App();

if (
  envVars.djangoBackendAppName &&
  envVars.stage &&
  envVars.account &&
  envVars.region &&
  envVars.djangoBackendSourcePath
) {
  console.info(
    "Deploying Django backend with config",
    {
      djangoBackendStackName,
      account: envVars.account,
      region: envVars.region,
      domainName: envVars.djangoBackendDomainName,
      domainCertificateArn: envVars.djangoBackendDomainCertificateARN,
      sourcePath: djangoBackendSourcePath,
      wsgiPath: envVars.djangoBackendWSGIPath,
      ec2InstanceType: envVars.djangoBackendEC2InstanceType,
      minimumInstanceCount: envVars.djangoBackendMinInstances,
      maximumInstanceCount: envVars.djangoBackendMaxInstances,
      logging: {
        enableWebServerLogStreaming: envVars.djangoBackendEnableWebServerLogs,
        enableHealthEventLogStreaming:
          envVars.djangoBackendEnableHealthEventLogs,
        enableHealthReporting: envVars.djangoBackendEnableHealthReporting,
      },
    },
    "\n"
  );

  new DjangoElasticBeanstalkBackendStack(app, djangoBackendStackName, {
    applicationName: djangoBackendStackName,
    environmentName: envVars.stage,
    domainName: envVars.djangoBackendDomainName,
    domainCertificateArn: envVars.djangoBackendDomainCertificateARN,
    sourcePath: djangoBackendSourcePath,
    wsgiPath: envVars.djangoBackendWSGIPath,
    ec2InstanceType: envVars.djangoBackendEC2InstanceType,
    minimumInstanceCount: envVars.djangoBackendMinInstances,
    maximumInstanceCount: envVars.djangoBackendMaxInstances,
    logging: {
      enableWebServerLogStreaming: envVars.djangoBackendEnableWebServerLogs,
      enableHealthEventLogStreaming: envVars.djangoBackendEnableHealthEventLogs,
      enableHealthReporting: envVars.djangoBackendEnableHealthReporting,
    },
    env: {
      account: envVars.account,
      region: envVars.region,
    },
  });
} else {
  console.error(
    `Missing required environment variables to deploy ${djangoBackendStackName}`
  );
}
