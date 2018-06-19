export interface ConvoResponse {
    speech: string;
    caption: string;
    displayMultiLine?: string[];
    leftPicture?: string;
    chips?: string[];
    reset?: boolean;
}
