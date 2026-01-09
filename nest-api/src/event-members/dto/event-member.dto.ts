import { IsInt, IsOptional, IsString } from 'class-validator';

export class AddMemberDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateMemberDto {
  @IsString()
  role: string;
}
