// State objects for the auditions feature

import { Audition } from '@makeit/types';

export interface AuditionsState {
    auditions: Audition[];
    loading: boolean;
    lastFetch: number;
}
