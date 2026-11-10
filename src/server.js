import { env } from "./configs/env.js"
import express from "express"
import apiRoutes from "./routes/api.js"
import cors from "cors"

const app = express()
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        service: "express-keycloak-demo"
    })
})

// API routes
app.use("/api", apiRoutes)

// Global error handler
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({
        message: "Internal Server Error"
    })
})

app.listen(env.port, () => {
    console.log(`Express server running on port ${env.port}`)
})