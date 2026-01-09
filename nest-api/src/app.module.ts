import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { EventMembersModule } from './event-members/event-members.module';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EventsModule, EventMembersModule, InvitationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
