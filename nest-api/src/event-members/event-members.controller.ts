import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { EventMembersService } from './event-members.service';
import { AddMemberDto, UpdateMemberDto } from './dto/event-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events/:eventId/members')
@UseGuards(JwtAuthGuard)
export class EventMembersController {
  constructor(private membersService: EventMembersService) {}

  @Get()
  getMembers(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.membersService.getMembers(eventId);
  }

  @Post()
  addMember(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: AddMemberDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.membersService.addMember(eventId, dto, req.user.id);
  }

  @Post('join')
  join(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.membersService.join(eventId, req.user.id);
  }

  @Delete('leave')
  leave(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.membersService.leave(eventId, req.user.id);
  }

  @Patch(':memberId')
  updateRole(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: UpdateMemberDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.membersService.updateRole(eventId, memberId, dto, req.user.id);
  }

  @Delete(':memberId')
  removeMember(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.membersService.removeMember(eventId, memberId, req.user.id);
  }
}
