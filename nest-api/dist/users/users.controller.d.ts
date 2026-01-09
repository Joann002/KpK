import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }[]>;
    getMe(req: {
        user: {
            id: number;
        };
    }): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    findOne(id: number): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    update(id: number, dto: UpdateUserDto, req: {
        user: {
            id: number;
        };
    }): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    remove(id: number, req: {
        user: {
            id: number;
        };
    }): Promise<void>;
}
