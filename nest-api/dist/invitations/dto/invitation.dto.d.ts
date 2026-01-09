export declare class InviteDto {
    userId: number;
    message?: string;
}
export declare enum RsvpStatus {
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED"
}
export declare class RsvpDto {
    status: RsvpStatus;
}
