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

export interface UserAccount extends BaseEntity {
    email: string;
    password?: string; //note this will not be populated by the server when returning account objects
    firstName: string;
    lastName: string;
    
    profiles: Profile[];
}