// Model / State objects for the auth feature

import { UserAccount, AccessToken } from '@makeit/types';


export interface AuthenticationState {
    user?: UserAccount;
    token?: AccessToken;
    refreshToken?: AccessToken;
    rememberMe: boolean;
    loading: boolean;
    refreshActive?: boolean;
}