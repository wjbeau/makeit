// Model / State objects for the auth feature

import { UserAccount } from '@makeit/types';


export interface UserState {
    user?: UserAccount;
    busy: boolean;
}