import path from "path";
import { App } from "aws-cdk-lib";
import getEnvVariables from "../src/utils/get-env-variables";
import { NodeJSElasticBeanstalkBackendStack } from "../src/stacks/nodejs-elastic-beanstalk-backend";

const envVars = getEnvVariables();
const camelCasedStage = envVars.stage[0].toUpperCase() + envVars.stage.slice(1);
const nodejsBackendStackName = `${envVars.nodejsBackendAppName}-${camelCasedStage}`;
const nodejsBackendSourcePath = path.resolve(
  process.cwd(),
  envVars.nodejsBackendSourcePath
);

const app = new App();

if (
  envVars.nodejsBackendAppName &&
  envVars.stage &&
  envVars.account &&
  envVars.region &&
  envVars.nodejsBackendSourcePath
) {
  console.info(
    "Deploying NodeJS backend with config",
    {
      nodejsBackendStackName,
      account: envVars.account,
      region: envVars.region,
      domainName: envVars.nodejsBackendDomainName,
      domainCertificateArn: envVars.nodejsBackendDomainCertificateARN,
      sourcePath: nodejsBackendSourcePath,
      ec2InstanceType: envVars.nodejsBackendEC2InstanceType,
      minimumInstanceCount: envVars.nodejsBackendMinInstances,
      maximumInstanceCount: envVars.nodejsBackendMaxInstances,
      logging: {
        enableWebServerLogStreaming: envVars.nodejsBackendEnableWebServerLogs,
        enableHealthEventLogStreaming:
          envVars.nodejsBackendEnableHealthEventLogs,
        enableHealthReporting: envVars.nodejsBackendEnableHealthReporting,
      },
    },
    "\n"
  );

  new NodeJSElasticBeanstalkBackendStack(app, nodejsBackendStackName, {
    applicationName: nodejsBackendStackName,
    environmentName: envVars.stage,
    domainName: envVars.nodejsBackendDomainName,
    domainCertificateArn: envVars.nodejsBackendDomainCertificateARN,
    sourcePath: nodejsBackendSourcePath,
    ec2InstanceType: envVars.nodejsBackendEC2InstanceType,
    minimumInstanceCount: envVars.nodejsBackendMinInstances,
    maximumInstanceCount: envVars.nodejsBackendMaxInstances,
    logging: {
      enableWebServerLogStreaming: envVars.nodejsBackendEnableWebServerLogs,
      enableHealthEventLogStreaming: envVars.nodejsBackendEnableHealthEventLogs,
      enableHealthReporting: envVars.nodejsBackendEnableHealthReporting,
    },
    env: {
      account: envVars.account,
      region: envVars.region,
    },
  });
} else {
  console.error(
    `Missing required environment variables to deploy ${nodejsBackendStackName}`
  );
}
