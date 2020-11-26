
export interface ApplicationMessages {
    messages: Message[];
}

export interface Message {
    type: string,
    message: string;
    args: string[];
}
