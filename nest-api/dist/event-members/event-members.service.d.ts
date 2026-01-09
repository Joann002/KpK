import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto, UpdateMemberDto } from './dto/event-member.dto';
export declare class EventMembersService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkEventOwner;
    addMember(eventId: number, dto: AddMemberDto, requesterId: number): Promise<{
        user: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        id: number;
        userId: number;
        role: string;
        joinedAt: Date;
        eventId: number;
    }>;
    join(eventId: number, userId: number): Promise<{
        event: {
            id: number;
            title: string;
        };
    } & {
        id: number;
        userId: number;
        role: string;
        joinedAt: Date;
        eventId: number;
    }>;
    leave(eventId: number, userId: number): Promise<void>;
    updateRole(eventId: number, memberId: number, dto: UpdateMemberDto, requesterId: number): Promise<{
        user: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        id: number;
        userId: number;
        role: string;
        joinedAt: Date;
        eventId: number;
    }>;
    removeMember(eventId: number, memberId: number, requesterId: number): Promise<void>;
    getMembers(eventId: number): Promise<({
        user: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        id: number;
        userId: number;
        role: string;
        joinedAt: Date;
        eventId: number;
    })[]>;
}
