# AWS Web 服务器部署

[English](README.md) | [中文](README.zh.md)

这是一个基于 TypeScript 的 AWS CDK 项目，用于将 Web 应用程序（Node.js 和 Django）部署到 AWS Elastic Beanstalk。该项目提供了强大且可扩展的解决方案，用于使用 AWS 服务托管 Web 应用程序。

## 功能特点

- 使用 AWS CDK 自动创建和持续部署基础设施
- 支持 Node.js 和 Django 后端部署
- 基于环境的部署（测试环境和生产环境）
- 可选的自定义域名配置和 SSL 证书
- 全面的日志记录和监控设置
- Web 应用程序的自动扩展配置
- 增强的健康报告和指标

## 前置要求

- 海外 AWS 账户
- 安装 AWS CLI（[参考文档](https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)）并配置适当的凭证（[参考文档](https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new)）。为了快速尝试，我建议使用带有长期凭证（`Long-term credentials`）的 CLI 命令：
  ```
  aws configure
  ```
- 全局安装 AWS CDK CLI（[参考文档](https://docs.aws.amazon.com/zh_cn/cdk/v2/guide/getting-started.html#getting-started-install)）：
  ```
  npm install -g aws-cdk
  ```

## 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/shuo-s-feng/web-server-on-aws.git
cd web-server-on-aws
```

2. 安装依赖：

```bash
yarn install
```

## 项目结构

```
.
├── bin/                    # CDK 应用入口点
│   ├── deploy-nodejs-backend.ts    # Node.js 后端部署
│   └── deploy-django-backend.ts    # Django 后端部署
├── src/                    # 源代码
│   ├── stacks/            # CDK 堆栈
│   └── utils/             # 工具函数
├── examples/              # 示例 Web 应用源代码
└── cdk.out/              # CDK 合成输出
```

## 环境配置

项目使用特定于环境的配置文件来管理不同的部署环境。在根目录更新以下文件：

### `.env.staging`

```bash
# AWS 配置
AWS_ACCOUNT='<AWS 账户ID，例如：123456789012>'
AWS_REGION='<AWS 区域，例如：us-east-1>'

# Node.js 后端配置
NODEJS_BACKEND_APP_NAME='<应用名称，例如：NodeJSBackend>'
# NODEJS_BACKEND_DOMAIN_NAME='<域名，例如：api.example.com>'
# NODEJS_BACKEND_DOMAIN_CERT_ARN='<SSL证书ARN，例如：arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx>'
NODEJS_BACKEND_SOURCE_PATH='<源代码路径，例如：./examples/nodejs-backend-dist>'
# NODEJS_BACKEND_EC2_INSTANCE_TYPE='<实例类型，例如：t3.small>'
# NODEJS_BACKEND_MIN_INSTANCES='<最小实例数，例如：1>'
# NODEJS_BACKEND_MAX_INSTANCES='<最大实例数，例如：2>'
# NODEJS_BACKEND_ENABLE_WEB_SERVER_LOGS='<true/false>'
# NODEJS_BACKEND_ENABLE_HEALTH_EVENT_LOGS='<true/false>'
# NODEJS_BACKEND_ENABLE_HEALTH_REPORTING='<true/false>'

# Django 后端配置
DJANGO_BACKEND_APP_NAME='<应用名称，例如：DjangoBackend>'
# DJANGO_BACKEND_DOMAIN_NAME='<域名，例如：api.example.com>'
# DJANGO_BACKEND_DOMAIN_CERT_ARN='<SSL证书ARN，例如：arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx>'
DJANGO_BACKEND_SOURCE_PATH='<源代码路径，例如：./examples/django-backend-dist>'
DJANGO_BACKEND_WSGI_PATH='<WSGI路径，例如：hello_world.wsgi:application>'
# DJANGO_BACKEND_EC2_INSTANCE_TYPE='<实例类型，例如：t3.small>'
# DJANGO_BACKEND_MIN_INSTANCES='<最小实例数，例如：1>'
# DJANGO_BACKEND_MAX_INSTANCES='<最大实例数，例如：2>'
# DJANGO_BACKEND_ENABLE_WEB_SERVER_LOGS='<true/false>'
# DJANGO_BACKEND_ENABLE_HEALTH_EVENT_LOGS='<true/false>'
# DJANGO_BACKEND_ENABLE_HEALTH_REPORTING='<true/false>'
```

### `.env.prod`

```bash
# AWS 配置
AWS_ACCOUNT='<AWS 账户ID，例如：123456789012>'
AWS_REGION='<AWS 区域，例如：us-east-1>'

# Node.js 后端配置
NODEJS_BACKEND_APP_NAME='<应用名称，例如：NodeJSBackend>'
# NODEJS_BACKEND_DOMAIN_NAME='<域名，例如：api.example.com>'
# NODEJS_BACKEND_DOMAIN_CERT_ARN='<SSL证书ARN，例如：arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx>'
NODEJS_BACKEND_SOURCE_PATH='<源代码路径，例如：./examples/nodejs-backend-dist>'
# NODEJS_BACKEND_EC2_INSTANCE_TYPE='<实例类型，例如：t3.small>'
# NODEJS_BACKEND_MIN_INSTANCES='<最小实例数，例如：1>'
# NODEJS_BACKEND_MAX_INSTANCES='<最大实例数，例如：2>'
# NODEJS_BACKEND_ENABLE_WEB_SERVER_LOGS='<true/false>'
# NODEJS_BACKEND_ENABLE_HEALTH_EVENT_LOGS='<true/false>'
# NODEJS_BACKEND_ENABLE_HEALTH_REPORTING='<true/false>'

# Django 后端配置
DJANGO_BACKEND_APP_NAME='<应用名称，例如：DjangoBackend>'
# DJANGO_BACKEND_DOMAIN_NAME='<域名，例如：api.example.com>'
# DJANGO_BACKEND_DOMAIN_CERT_ARN='<SSL证书ARN，例如：arn:aws:acm:region:account:certificate/xxxx-xxxx-xxxx-xxxx>'
DJANGO_BACKEND_SOURCE_PATH='<源代码路径，例如：./examples/django-backend-dist>'
DJANGO_BACKEND_WSGI_PATH='<WSGI路径，例如：hello_world.wsgi:application>'
# DJANGO_BACKEND_EC2_INSTANCE_TYPE='<实例类型，例如：t3.small>'
# DJANGO_BACKEND_MIN_INSTANCES='<最小实例数，例如：1>'
# DJANGO_BACKEND_MAX_INSTANCES='<最大实例数，例如：2>'
# DJANGO_BACKEND_ENABLE_WEB_SERVER_LOGS='<true/false>'
# DJANGO_BACKEND_ENABLE_HEALTH_EVENT_LOGS='<true/false>'
# DJANGO_BACKEND_ENABLE_HEALTH_REPORTING='<true/false>'
```

请将占位符值替换为您的实际配置。注释行是可选的，如果您想使用带有 SSL 证书的自定义域名，可以取消注释。

## 部署

### 环境设置

1. 按照上述说明更新环境配置文件
2. 填写适合您 AWS 账户和应用程序配置的值
3. 如果使用自定义域名，请取消注释并配置域名相关变量

### Node.js 后端部署

#### 测试环境

```bash
yarn deploy-nodejs-backend:staging
```

#### 生产环境

```bash
yarn deploy-nodejs-backend:prod
```

### Django 后端部署

#### 测试环境

```bash
yarn deploy-django-backend:staging
```

#### 生产环境

```bash
yarn deploy-django-backend:prod
```

注意：在部署之前，请确保您的 AWS 凭证已正确配置。部署过程将使用相应 `.env.*` 文件中的环境特定配置。

## 创建的 AWS 资源

部署后，以下的主要资源将在您的 AWS 账户中创建：

- **CloudFormation** - 中心化管理部署相关的所有 AWS 资源
- **Elastic Beanstalk Application** - Web 应用程序的容器
- **Elastic Beanstalk Environment** - 应用程序的运行环境
- **EC2 Instances** - 运行应用程序的自动扩展实例组
- **Application Load Balancer** - 在实例之间分配流量
- **CloudWatch Logs** - 应用程序和健康事件日志（如果启用）
- **CloudWatch Metrics** - 增强的健康报告指标（如果启用）
- **Route 53 Records** - 自定义域名配置（如果启用）

CloudFormation 示例截图（NodeJS）：

![CloudFormation Stack Screenshot](./examples/nodejs-cloudformation-screenshot.png)

您可以通过以下方式访问您的应用程序：

- **Elastic Beanstalk 域名：** 环境域名会显示在 AWS 控制台的环境页面。例如（NodeJS）：

  ![Elastic Beanstalk Environment Domain Example](./examples/nodejs-elasticbeanstalk-domain-screenshot.png)

  在 AWS Elastic Beanstalk 控制台，进入您的环境（如 `NodeJSBackend-Staging` 或 `DjangoBackend-Staging`），在环境概览面板的"Domain"部分可以看到如上图所示的域名。这就是您访问已部署后端的 URL。

- **自定义域名（如已配置）：** `https://{your-api-domain-name}`
