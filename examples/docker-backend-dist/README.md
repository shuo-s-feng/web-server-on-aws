# Docker Backend Example

A simple Node.js/Express application designed to be deployed on AWS Elastic Beanstalk using Docker containers.

## Features

- **Express.js** web framework
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers
- **Health check** endpoint for Elastic Beanstalk monitoring
- **Docker** containerization
- **Graceful shutdown** handling
- **Environment-aware** configuration

## API Endpoints

- `GET /` - Root endpoint with basic information
- `GET /health` - Health check endpoint (used by Elastic Beanstalk)
- `GET /api/status` - Service status information
- `GET /api/info` - Detailed service information and available endpoints

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:3000`

## Docker Development

1. Build the Docker image:

   ```bash
   docker build -t docker-backend-example .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 docker-backend-example
   ```

3. The application will be available at `http://localhost:3000`

## Deployment

This application is designed to be deployed using the AWS CDK stack in the parent directory. The deployment process will:

1. Package the application as a Docker image
2. Deploy it to AWS Elastic Beanstalk
3. Configure load balancing, auto-scaling, and monitoring
4. Set up HTTPS and custom domain (if configured)

## Environment Variables

- `PORT` - Port number (default: 3000)
- `NODE_ENV` - Environment name (development, staging, production)

## Health Check

The `/health` endpoint returns:

- Application status
- Current timestamp
- Uptime information
- Environment name

This endpoint is used by Elastic Beanstalk to monitor the health of your application.

## Security

The application includes several security features:

- Helmet.js for security headers
- CORS configuration
- Input validation
- Error handling without exposing sensitive information

## Monitoring

When deployed to AWS Elastic Beanstalk, the application will:

- Stream logs to CloudWatch
- Provide enhanced health monitoring
- Support auto-scaling based on load
- Include detailed metrics and alerts
