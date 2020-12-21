// State objects for the auditions feature

import { Event } from '@makeit/types';

export interface EventsState {
    events: Event[];
    loading: boolean;
}

export interface EventQueryCriteria {
    from: Date,
    to: Date,
    types?: []
}
