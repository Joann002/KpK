import { Module } from '@nestjs/common';
import { EventMembersController } from './event-members.controller';
import { EventMembersService } from './event-members.service';

@Module({
  controllers: [EventMembersController],
  providers: [EventMembersService],
})
export class EventMembersModule {}
