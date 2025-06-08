import dotenv from "dotenv";
import path from "path";
import { env } from "process";

export const getEnvVariables = () => {
  const envFile = `.env.${env.NODE_ENV}`;

  console.info(`Parsing environment variables from ${envFile}\n`);
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });

  const envVariables = {
    stage: env.NODE_ENV ?? "",
    account: env.AWS_ACCOUNT ?? "",
    region: env.AWS_REGION,

    nodejsBackendAppName: env.NODEJS_BACKEND_APP_NAME ?? "NodeJSBackend",
    nodejsBackendDomainName: env.NODEJS_BACKEND_DOMAIN_NAME ?? "",
    nodejsBackendDomainCertificateARN: env.NODEJS_BACKEND_DOMAIN_CERT_ARN ?? "",
    nodejsBackendSourcePath: env.NODEJS_BACKEND_SOURCE_PATH ?? "",
    nodejsBackendEC2InstanceType:
      env.NODEJS_BACKEND_EC2_INSTANCE_TYPE ?? "t3.small",
    nodejsBackendMinInstances: parseInt(
      env.NODEJS_BACKEND_MIN_INSTANCES ?? "1",
      10
    ),
    nodejsBackendMaxInstances: parseInt(
      env.NODEJS_BACKEND_MAX_INSTANCES ?? "2",
      10
    ),
    nodejsBackendEnableWebServerLogs:
      env.NODEJS_BACKEND_ENABLE_WEB_SERVER_LOGS === "true",
    nodejsBackendEnableHealthEventLogs:
      env.NODEJS_BACKEND_ENABLE_HEALTH_EVENT_LOGS === "true",
    nodejsBackendEnableHealthReporting:
      env.NODEJS_BACKEND_ENABLE_HEALTH_REPORTING === "true",

    djangoBackendAppName: env.DJANGO_BACKEND_APP_NAME ?? "DjangoBackend",
    djangoBackendDomainName: env.DJANGO_BACKEND_DOMAIN_NAME ?? "",
    djangoBackendDomainCertificateARN: env.DJANGO_BACKEND_DOMAIN_CERT_ARN ?? "",
    djangoBackendSourcePath: env.DJANGO_BACKEND_SOURCE_PATH ?? "",
    djangoBackendWSGIPath: env.DJANGO_BACKEND_WSGI_PATH ?? "",
    djangoBackendEC2InstanceType:
      env.DJANGO_BACKEND_EC2_INSTANCE_TYPE ?? "t3.small",
    djangoBackendMinInstances: parseInt(
      env.DJANGO_BACKEND_MIN_INSTANCES ?? "1",
      10
    ),
    djangoBackendMaxInstances: parseInt(
      env.DJANGO_BACKEND_MAX_INSTANCES ?? "2",
      10
    ),
    djangoBackendEnableWebServerLogs:
      env.DJANGO_BACKEND_ENABLE_WEB_SERVER_LOGS === "true",
    djangoBackendEnableHealthEventLogs:
      env.DJANGO_BACKEND_ENABLE_HEALTH_EVENT_LOGS === "true",
    djangoBackendEnableHealthReporting:
      env.DJANGO_BACKEND_ENABLE_HEALTH_REPORTING === "true",
  };

  return envVariables;
};

export default getEnvVariables;
