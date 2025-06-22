# Web Server Deployment on AWS

[English](README.md) | [中文](README.zh.md)

A TypeScript-based AWS CDK project for deploying web applications (Node.js, Django, and Docker) to AWS Elastic Beanstalk. This project provides a robust and scalable solution for hosting web applications using AWS services.

## Features

- Automated infrastructure creation and continuous deployment using AWS CDK
- Support for multiple backend types: Node.js, Django, and Docker
- Environment-based deployment (staging and production)
- Optional custom domain configuration with SSL certificates
- Comprehensive logging and monitoring setup
- Auto-scaling configuration for web applications
- Enhanced health reporting and metrics

## Prerequisites

- AWS Account
- AWS CLI installed ([Reference](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)) and configured with appropriate credentials ([Reference](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new)). To try out quickly, I recommend to use CLI commands with long-term credentials:
  ```
  aws configure
  ```
- AWS CDK CLI installed globally ([Reference](https://docs.aws.amazon.com/cdk/v2/guide/getting-started.html#getting-started-install)):
  ```
  npm install -g aws-cdk
  ```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shuo-s-feng/web-server-on-aws.git
cd web-server-on-aws
```

2. Install dependencies:

```bash
yarn install
```

## Project Structure

```
.
├── bin/                    # CDK app entry points
│   └── deploy-elastic-beanstalk.ts    # Elastic Beanstalk deployment
├── lib/                    # CDK constructs
│   └── elastic-beanstalk/  # Elastic Beanstalk constructs
├── configs/                # Environment configuration files
│   ├── .env.staging.django # Django staging configuration
│   ├── .env.staging.nodejs # Node.js staging configuration
│   ├── .env.staging.docker # Docker staging configuration
│   ├── .env.prod.django    # Django production configuration
│   ├── .env.prod.nodejs    # Node.js production configuration
│   └── .env.prod.docker    # Docker production configuration
└── examples/               # Example web app source code
    ├── django-backend-dist/    # Django example application
    ├── nodejs-backend-dist/    # Node.js example application
    └── docker-backend-dist/    # Docker example application
```

## Environment Configuration

The project uses environment-specific configuration files to manage different deployment environments and backend types. Each backend type has its own configuration file for better organization and clarity.

### Configuration Files Structure

- **Django Backend**: `configs/.env.{environment}.django`
- **Node.js Backend**: `configs/.env.{environment}.nodejs`
- **Docker Backend**: `configs/.env.{environment}.docker`

Where `{environment}` can be `staging` or `prod`.

### Configuration Examples

#### Django Backend Core Configuration (`.env.staging.django`)

```bash
# AWS Configuration
AWS_ACCOUNT='<AWS_ACCOUNT, e.g. 123456789012>'
AWS_REGION='<AWS_REGION, e.g. us-east-1>'

# Name of the Elastic Beanstalk application
BACKEND_APP_NAME='DjangoBackend'

# Solution stack name for the Elastic Beanstalk environment.
# Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.python
# Please check the latest solution stack name before deploying as it may change frequently and the old ones may fail to deploy.
BACKEND_SOLUTION_STACK_NAME='64bit Amazon Linux 2023 v4.5.2 running Python 3.12'

# (Optional) Custom domain name for the application
# BACKEND_DOMAIN_NAME='example.com'

# (Optional) ARN of the ACM SSL certificate for HTTPS support
# BACKEND_DOMAIN_CERT_ARN='arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx'

# Local path to the application source code
BACKEND_SOURCE_PATH='./examples/django-backend-dist'

# WSGI path for the Django application
DJANGO_BACKEND_WSGI_PATH='hello_world.wsgi:application'

# Path to the static files for the Django application
BACKEND_STATIC_FILES_PATH='/staticfiles'
```

#### Node.js Backend Core Configuration (`.env.staging.nodejs`)

```bash
# AWS Configuration
AWS_ACCOUNT='<AWS_ACCOUNT, e.g. 123456789012>'
AWS_REGION='<AWS_REGION, e.g. us-east-1>'

# Name of the Elastic Beanstalk application
BACKEND_APP_NAME='NodeJsBackend'

# Solution stack name for the Elastic Beanstalk environment.
# Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.nodejs
# Please check the latest solution stack name before deploying as it may change frequently and the old ones may fail to deploy.
BACKEND_SOLUTION_STACK_NAME='64bit Amazon Linux 2023 v6.5.2 running Node.js 22'

# (Optional) Custom domain name for the application
# BACKEND_DOMAIN_NAME='example.com'

# (Optional) ARN of the ACM SSL certificate for HTTPS support
# BACKEND_DOMAIN_CERT_ARN='arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx'

# Local path to the application source code
BACKEND_SOURCE_PATH='./examples/nodejs-backend-dist'
```

#### Docker Backend Core Configuration (`.env.staging.docker`)

```bash
# AWS Configuration
AWS_ACCOUNT='<AWS_ACCOUNT, e.g. 123456789012>'
AWS_REGION='<AWS_REGION, e.g. us-east-1>'

# Name of the Elastic Beanstalk application
BACKEND_APP_NAME='DockerBackend'

# Solution stack name for the Elastic Beanstalk environment.
# Reference: https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.docker
# Please check the latest solution stack name before deploying as it may change frequently and the old ones may fail to deploy.
BACKEND_SOLUTION_STACK_NAME='64bit Amazon Linux 2023 v4.5.2 running Docker'

# (Optional) Custom domain name for the application
# BACKEND_DOMAIN_NAME='example.com'

# (Optional) ARN of the ACM SSL certificate for HTTPS support
# BACKEND_DOMAIN_CERT_ARN='arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx'

# Local path to the application source code
BACKEND_SOURCE_PATH='./examples/docker-backend-dist'

# Container port for the Docker application
DOCKER_BACKEND_CONTAINER_PORT='3000'
```

### Configuration Setup

1. Choose the appropriate configuration file based on your backend type and environment
2. Update the configuration values with your actual AWS account and application settings
3. Replace placeholder values with your specific configuration
4. For custom domain support, uncomment and configure the domain-related variables

## Deployment

### Environment Setup

1. Update the appropriate environment configuration file as described above
2. Fill in the correct values for your AWS account and application configuration
3. If using a custom domain, uncomment and configure the domain-related variables

### Deployment Commands

#### Django Backend Deployment

**Staging Environment:**

```bash
yarn deploy-django-backend:staging
```

**Production Environment:**

```bash
yarn deploy-django-backend:prod
```

#### Node.js Backend Deployment

**Staging Environment:**

```bash
yarn deploy-nodejs-backend:staging
```

**Production Environment:**

```bash
yarn deploy-nodejs-backend:prod
```

#### Docker Backend Deployment

**Staging Environment:**

```bash
yarn deploy-docker-backend:staging
```

**Production Environment:**

```bash
yarn deploy-docker-backend:prod
```

**Note:** Make sure your AWS credentials are properly configured before deployment. The deployment process will use the environment-specific configuration from the respective `.env.*.*` file.

## Created AWS Resources

After deployment, the following main resources will be created in your AWS account:

- **CloudFormation** - Centralized management of all AWS resources related to deployment
- **Elastic Beanstalk Application** - Container for the web application
- **Elastic Beanstalk Environment** - Runtime environment for the application
- **EC2 Instances** - Auto-scaling group of instances running the application
- **Application Load Balancer** - Distributes traffic across instances
- **CloudWatch Logs** - Application and health event logs (if enabled)
- **CloudWatch Metrics** - Enhanced health reporting metrics (if enabled)
- **Route 53 Records** - Custom domain configuration (if enabled)

CloudFormation example screenshot (NodeJS):

![CloudFormation Stack Screenshot](./examples/nodejs-cloudformation-screenshot.png)

You can access your application through:

- **Elastic Beanstalk domain:** The environment domain is shown in the AWS Console for your environment. For example (NodeJS):

  ![Elastic Beanstalk Environment Domain Example](./examples/nodejs-elasticbeanstalk-domain-screenshot.png)

  In the AWS Elastic Beanstalk Console, navigate to your environment (e.g., `NodeJSBackend-Staging` or `DjangoBackend-Staging`). The environment overview panel will display the domain under the "Domain" section, as shown above. This is the URL you can use to access your deployed backend.

- **Custom domain (if configured):** `https://{your-api-domain-name}`
