export declare class UpdateUserDto {
    email?: string;
    name?: string;
    password?: string;
}
export declare class UserResponseDto {
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
}
