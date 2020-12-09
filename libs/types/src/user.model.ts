import { Profile } from './profile.model';
import { BaseEntity } from './base.model';

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string,
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
    profiles: Profile[];
}