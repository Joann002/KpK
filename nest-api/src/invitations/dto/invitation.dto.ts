import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';

export class InviteDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export enum RsvpStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export class RsvpDto {
  @IsEnum(RsvpStatus)
  status: RsvpStatus;
}
