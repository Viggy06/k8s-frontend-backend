const tasks = require("./routes/tasks");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const client = require("prom-client"); //Prometheus-Grafana
const app = express();
const mongoose = require('mongoose');

connection();

app.use(express.json());
app.use(cors());

// Health check endpoints

// Basic health check to see if the server is running
app.get('/healthz', (req, res) => {
    res.status(200).send('Healthy');
});

let lastReadyState = null;  
// Readiness check to see if the server is ready to serve requests
app.get('/ready', (req, res) => {
    // Here you can add logic to check database connection or other dependencies
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected !== lastReadyState) {
        console.log(`Database readyState: ${mongoose.connection.readyState}`);
        lastReadyState = isDbConnected;
    }
    
    if (isDbConnected) {
        res.status(200).send('Ready');
    } else {
        res.status(503).send('Not Ready');
    }
});

// Startup check to ensure the server has started correctly
app.get('/started', (req, res) => {
    // Assuming the server has started correctly if this endpoint is reachable
    res.status(200).send('Started');
});

app.use("/api/tasks", tasks);

const port = process.env.PORT || 3500;

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(port, () => console.log(`Listening on port ${port}...`));


// ===== Prometheus setup =====
client.collectDefaultMetrics();

// Custom HTTP request counter
const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"]
});

// Middleware to count requests
app.use((req, res, next) => {
    res.on("finish", () => {
        httpRequestsTotal.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode
        });
    });
    next();
});
