import { createRemoteJWKSet, jwtVerify } from 'jose'
import { env } from '../configs/env.js'

// const issuer = process.env.KEYCLOAK_ISSUER
// const issuer = "http://localhost:8080/realms/logging"
// const clientId = process.env.KEYCLOAK_CLIENT_ID
// const clientId = "express-api"
const issuer = env.keycloakIssuer
const clientId = env.keycloakClientId

const jwks = createRemoteJWKSet(
    new URL(`${issuer}/protocol/openid-connect/certs`)
)

// Verify Access Token
export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Missing Bearer Token"
            })
        }

        const token = authHeader.substring(7)

        const { payload } = await jwtVerify(token, jwks, {
            issuer
        })

        // Extract roles
        const realmRoles = payload.realm_access?.roles || []

        const clientRoles =
            payload.resource_access?.[clientId]?.roles || []

        req.user = {
            id: payload.sub,
            username: payload.preferred_username,
            email: payload.email,
            name: payload.name,
            realmRoles,
            clientRoles
        }

        next()
    } catch (error) {
        console.error("Authentication failed:", error.message)

        return res.status(401).json({
            message: "Invalid or expired access token"
        })
    }
}

// Check Realm Role
export function requireRealmRole (...roles) {
    return (req, res, next) => {
        const userRoles = req.user?.realmRoles || []

        const hasRole = roles.some(role =>
            userRoles.includes(role)
        )

        if (!hasRole) {
            return res.status(403).json({
                message: "Forbidden: Insufficient Realm Role"
            })
        }

        next()
    }
}

// Check Client Role
export function requireClientRole (...roles) {
    return (req, res, next) => {
        const userRoles = req.user?.clientRoles || []

        const hasRole = roles.some(role =>
            userRoles.includes(role)
        )

        if (!hasRole) {
            return res.status(403).json({
                message: "Forbidden: Insufficient Client Role"
            })
        }

        next()
    }
}