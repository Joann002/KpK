import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, TokensDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<TokensDto>;
    login(dto: LoginDto): Promise<TokensDto>;
    logout(userId: number): Promise<void>;
    refresh(userId: number, refreshToken: string): Promise<TokensDto>;
    private generateTokens;
    private updateRefreshToken;
}
