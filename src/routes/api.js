import { Router } from "express"

import { authenticate, requireRealmRole, requireClientRole } from "../middlewares/auth-middleware.js"

const router = Router()

// Public API
router.get("/public", (req, res) => {
    res.json({
        message: "This is a public API",
        authenticated: false
    })
})

// Authenticated API
router.get("/me", authenticate, (req, res) => {
    res.json({
        message: "Authentication successful",
        user: req.user
    })
})

// Realm Role: user
router.get("/user", authenticate, requireRealmRole("USER"), (req, res) => {
    res.json({
        message: "Welcome, user!",
        user: req.user
    })
})

// Realm Role: admin
router.get("/admin", authenticate, requireRealmRole("ADMIN"), (req, res) => {
    res.json({
        message: "Welcome, administrator!",
        user: req.user
    })
})

// Client Role: api-admin
router.get("/client-admin", authenticate, requireClientRole("api-admin"), (req, res) => {
    res.json({
        message: "Client role authorization successful",
        user: req.user
    })
})

export default router