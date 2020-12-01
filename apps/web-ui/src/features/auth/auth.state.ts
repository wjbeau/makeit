// Model / State objects for the auth feature

import { UserAccount } from "@makeit/types";


export interface AuthenticationState {
    user?: UserAccount;
    token?: string;
    loading: boolean;
}