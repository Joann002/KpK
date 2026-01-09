import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEventDto, ownerId: number): Promise<{
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
    }>;
    findAll(): Promise<({
        _count: {
            members: number;
        };
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
    })[]>;
    findOne(id: number): Promise<{
        owner: {
            email: string;
            name: string;
            id: number;
        };
        members: ({
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
        })[];
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
    }>;
    update(id: number, dto: UpdateEventDto, userId: number): Promise<{
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
    }>;
    remove(id: number, userId: number): Promise<void>;
    findMyEvents(userId: number): Promise<({
        _count: {
            members: number;
        };
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
    })[]>;
}
