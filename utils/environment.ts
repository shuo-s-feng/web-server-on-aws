import path from "path";
import dotenv from "dotenv";
import { env } from "process";

export const getBaseEnvVariables = () => {
  const stage = env.NODE_ENV;
  const framework = env.FRAMEWORK;

  if (!stage || !framework) {
    throw new Error("NODE_ENV and FRAMEWORK must be set");
  }

  const envFile = `./configs/.env.${stage}.${framework}`;

  console.info(`Parsing environment variables from ${envFile}\n`);
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });

  return {
    framework: env.FRAMEWORK ?? "",
    stage: env.NODE_ENV ?? "",
    account: env.AWS_ACCOUNT ?? "",
    region: env.AWS_REGION,
  };
};

export default getBaseEnvVariables;
