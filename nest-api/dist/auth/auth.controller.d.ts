import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, TokensDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<TokensDto>;
    login(dto: LoginDto): Promise<TokensDto>;
    logout(req: {
        user: {
            id: number;
        };
    }): Promise<void>;
    refresh(req: {
        user: {
            id: number;
            refreshToken: string;
        };
    }): Promise<TokensDto>;
}
