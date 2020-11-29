// Model / State objects for the auth feature

export interface AuditionsState {
    auditions: Audition[];
    loading: boolean;
}

export interface Audition {
    id: string;
    subject: string;
    type: string;
    startTime: string;
    endTime: string;
    location?: any;
}

