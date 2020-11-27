// Model / State objects for the auth feature

import { Address } from "cluster";

export interface MeetingsState {
    meetings: Meeting[];
    loading: boolean;
}

export interface Meeting {
    id: string;
    subject: string;
    type: string;
    startTime: string;
    endTime: string;
    location?: Address;
}

