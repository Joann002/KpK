import { EventMembersService } from './event-members.service';
import { AddMemberDto, UpdateMemberDto } from './dto/event-member.dto';
export declare class EventMembersController {
    private membersService;
    constructor(membersService: EventMembersService);
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
    addMember(eventId: number, dto: AddMemberDto, req: {
        user: {
            id: number;
        };
    }): Promise<{
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
    join(eventId: number, req: {
        user: {
            id: number;
        };
    }): Promise<{
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
    leave(eventId: number, req: {
        user: {
            id: number;
        };
    }): Promise<void>;
    updateRole(eventId: number, memberId: number, dto: UpdateMemberDto, req: {
        user: {
            id: number;
        };
    }): Promise<{
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
    removeMember(eventId: number, memberId: number, req: {
        user: {
            id: number;
        };
    }): Promise<void>;
}
