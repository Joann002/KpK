import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    remove(id: number): Promise<void>;
}
