
export interface ApplicationMessages {
    messages: LogMessage[];
}

export interface LogMessage {
    type: string,
    message: string;
    args: string[];
}
