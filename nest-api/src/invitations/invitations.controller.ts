import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InviteDto, RsvpDto } from './dto/invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Post('events/:eventId/invitations')
  invite(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: InviteDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.invitationsService.invite(eventId, dto, req.user.id);
  }

  @Get('events/:eventId/invitations')
  getEventInvitations(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.invitationsService.getEventInvitations(eventId, req.user.id);
  }

  @Delete('invitations/:id')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.invitationsService.cancelInvitation(id, req.user.id);
  }

  @Get('invitations/my')
  getMyInvitations(@Req() req: { user: { id: number } }) {
    return this.invitationsService.getMyInvitations(req.user.id);
  }

  @Post('invitations/:id/rsvp')
  rsvp(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RsvpDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.invitationsService.rsvp(id, dto, req.user.id);
  }
}
