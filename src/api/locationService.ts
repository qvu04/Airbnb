import { https } from "./config"

export const getLocationService = () => {
    return https.get("/api/vi-tri");
}