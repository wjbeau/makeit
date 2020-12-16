export const SERVER_URL = process.env.NX_WEB_UI_SERVER_URL || "http://localhost:3333/api";
export const ACTIVE_TOKEN_KEY = process.env.NX_WEB_UI_ACTIVE_TOKEN_KEY || "ActiveJWTToken";
export const REFRESH_TOKEN_KEY = process.env.NX_WEB_UI_REFRESH_TOKEN_KEY || "RefreshJWTToken";
export const APP_VERSION = process.env.NX_WEB_UI_VERSION || "dev"