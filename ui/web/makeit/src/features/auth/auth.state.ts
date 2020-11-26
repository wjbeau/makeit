// Model / State objects for the auth feature

export interface AuthRequest {
    username: string;
    password: string;
}

export interface UserAccount {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface AuthenticationState {
    user?: UserAccount;
    loading: boolean;
}
