import { PrismaService } from '../prisma/prisma.service';
import { InviteDto, RsvpDto } from './dto/invitation.dto';
export declare class InvitationsService {
    private prisma;
    constructor(prisma: PrismaService);
    invite(eventId: number, dto: InviteDto, requesterId: number): Promise<{
        user: {
            email: string;
            name: string;
            id: number;
        };
        event: {
            id: number;
            title: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        eventId: number;
        message: string | null;
        status: import(".prisma/client").$Enums.InvitationStatus;
    }>;
    rsvp(invitationId: number, dto: RsvpDto, userId: number): Promise<{
        event: {
            id: number;
            title: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        eventId: number;
        message: string | null;
        status: import(".prisma/client").$Enums.InvitationStatus;
    }>;
    getMyInvitations(userId: number): Promise<({
        event: {
            owner: {
                email: string;
                name: string;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            startDate: Date;
            endDate: Date | null;
            location: string | null;
            ownerId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        eventId: number;
        message: string | null;
        status: import(".prisma/client").$Enums.InvitationStatus;
    })[]>;
    getEventInvitations(eventId: number, requesterId: number): Promise<({
        user: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        eventId: number;
        message: string | null;
        status: import(".prisma/client").$Enums.InvitationStatus;
    })[]>;
    cancelInvitation(invitationId: number, requesterId: number): Promise<void>;
}
