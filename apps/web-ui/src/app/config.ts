export const SERVER_URL = process.env.NX_WEB_UI_SERVER_URL || "http://localhost:3333/api";
export const ACTIVE_TOKEN_KEY = process.env.NX_WEB_UI_ACTIVE_TOKEN_KEY || "ActiveJWTToken";
export const REFRESH_TOKEN_KEY = process.env.NX_WEB_UI_REFRESH_TOKEN_KEY || "RefreshJWTToken";
export const REFRESH_USER_KEY = process.env.NX_WEB_UI_REFRESH_TOKEN_USERNAME || "RefreshJWTTokenUser";
export const APP_VERSION = process.env.NX_WEB_UI_VERSION || "dev"
export const NX_WEB_UI_EMAILJS_USERID = process.env.NX_WEB_UI_EMAILJS_USERID || "unknown"
export const NX_WEB_UI_EMAILJS_TEMPLATEID = process.env.NX_WEB_UI_EMAILJS_TEMPLATEID || "unknown"