// Model / State objects for the auth feature

import { AccessToken } from '@makeit/types';


export interface AuthenticationState {
    token?: AccessToken;
    refreshToken?: AccessToken;
    rememberMe: boolean;
    loading: boolean;
    refreshActive?: boolean;
}