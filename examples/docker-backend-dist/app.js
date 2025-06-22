const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint for Elastic Beanstalk
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hello from Docker Backend!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API endpoints
app.get("/api/status", (req, res) => {
  res.json({
    status: "running",
    service: "docker-backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    service: "Docker Backend Example",
    description:
      "A simple Node.js/Express application deployed on AWS Elastic Beanstalk",
    features: [
      "Express.js web framework",
      "CORS enabled",
      "Security headers with Helmet",
      "Health check endpoint",
      "Docker containerized",
      "AWS Elastic Beanstalk deployment",
    ],
    endpoints: [
      "GET / - Root endpoint",
      "GET /health - Health check",
      "GET /api/status - Service status",
      "GET /api/info - Service information",
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api/status",
      "GET /api/info",
    ],
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Docker Backend server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
