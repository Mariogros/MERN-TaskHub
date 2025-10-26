const { v4: uuidv4 } = require('uuid');

// In-memory metrics storage
const metrics = {
  totalRequests: 0,
  requestsByEndpoint: {},
  requestsByMethod: {},
  responseTimes: [],
  errors: 0,
  startTime: Date.now()
};

// Middleware to track request ID
const requestIdMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Middleware to track metrics
const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Increment total requests
  metrics.totalRequests++;
  
  // Track by endpoint
  const endpoint = req.path;
  metrics.requestsByEndpoint[endpoint] = (metrics.requestsByEndpoint[endpoint] || 0) + 1;
  
  // Track by method
  const method = req.method;
  metrics.requestsByMethod[method] = (metrics.requestsByMethod[method] || 0) + 1;
  
  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Store response time
    metrics.responseTimes.push(duration);
    
    // Keep only last 100 response times to avoid memory issues
    if (metrics.responseTimes.length > 100) {
      metrics.responseTimes.shift();
    }
    
    // Track errors
    if (res.statusCode >= 400) {
      metrics.errors++;
    }
  });
  
  next();
};

// Get current metrics
const getMetrics = () => {
  const avgResponseTime = metrics.responseTimes.length > 0
    ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
    : 0;
  
  const uptime = Date.now() - metrics.startTime;
  
  return {
    totalRequests: metrics.totalRequests,
    requestsByEndpoint: metrics.requestsByEndpoint,
    requestsByMethod: metrics.requestsByMethod,
    averageResponseTime: Math.round(avgResponseTime * 100) / 100, // Round to 2 decimals
    errors: metrics.errors,
    uptime: Math.round(uptime / 1000), // seconds
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  requestIdMiddleware,
  metricsMiddleware,
  getMetrics
};
