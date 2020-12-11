// State objects for the auditions feature

import { Contact } from '@makeit/types';

export interface ContactsState {
    contacts: Contact[];
    loading: boolean;
}
