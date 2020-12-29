import { Profile } from './profile.model';
import { BaseEntity } from './base.model';

export interface AuthRequest {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface RefreshRequest {
    username: string;
    token: string;
}

export interface AuthResponse {
    access_token: AccessToken,
    refresh_token: AccessToken,
    user: UserAccount
}

export interface PersonInfo extends BaseEntity {
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface UserAccount extends PersonInfo {
    email: string;
    password?: string; //note this will not be populated by the server when returning account objects
    tokens?: AccessToken[];
    profiles: Profile[];
}

export interface AccessToken extends BaseEntity {
    token: string;
    expires: Date;
    type: AccessTokenType;
}

export enum AccessTokenType {
    Auth="auth",
    Refresh="refresh"
}

export interface PasswordChangeRequest {
    oldPassword: string;
    newPassword: string;
}