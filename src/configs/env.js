import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    keycloakIssuer: process.env.KEYCLOAK_ISSUER,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID
}

if (!env.keycloakIssuer) {
    throw new Error("KEYCLOAK_ISSUER is not configured")
}

if (!env.keycloakClientId) {
    throw new Error("KEYCLOAK_CLIENT_ID is not configured")
}