export interface ConvoResponse {
    intent?: string;
    speech: string;
    caption: string;
    displayMultiLine?: string[];
    leftPicture?: string;
    chips?: string[];
    reset?: boolean;
}
