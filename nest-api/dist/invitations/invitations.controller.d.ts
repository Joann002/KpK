import { InvitationsService } from './invitations.service';
import { InviteDto, RsvpDto } from './dto/invitation.dto';
export declare class InvitationsController {
    private invitationsService;
    constructor(invitationsService: InvitationsService);
    invite(eventId: number, dto: InviteDto, req: {
        user: {
            id: number;
        };
    }): Promise<{
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
    getEventInvitations(eventId: number, req: {
        user: {
            id: number;
        };
    }): Promise<({
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
    cancel(id: number, req: {
        user: {
            id: number;
        };
    }): Promise<void>;
    getMyInvitations(req: {
        user: {
            id: number;
        };
    }): Promise<({
        event: {
            id: number;
            title: string;
            startDate: Date;
            location: string;
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
    rsvp(id: number, dto: RsvpDto, req: {
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
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        eventId: number;
        message: string | null;
        status: import(".prisma/client").$Enums.InvitationStatus;
    }>;
}
