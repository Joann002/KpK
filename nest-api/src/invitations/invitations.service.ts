import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteDto, RsvpDto } from './dto/invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async invite(eventId: number, dto: InviteDto, requesterId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Événement non trouvé');
    if (event.ownerId !== requesterId) throw new ForbiddenException('Seul le créateur peut inviter');

    const existingInvite = await this.prisma.invitation.findUnique({
      where: { userId_eventId: { userId: dto.userId, eventId } },
    });
    if (existingInvite) throw new ConflictException('Invitation déjà envoyée');

    const existingMember = await this.prisma.eventMember.findUnique({
      where: { userId_eventId: { userId: dto.userId, eventId } },
    });
    if (existingMember) throw new ConflictException('Utilisateur déjà membre');

    return this.prisma.invitation.create({
      data: { eventId, userId: dto.userId, message: dto.message },
      include: {
        user: { select: { id: true, email: true, name: true } },
        event: { select: { id: true, title: true } },
      },
    });
  }

  async rsvp(invitationId: number, dto: RsvpDto, userId: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { event: true },
    });
    if (!invitation) throw new NotFoundException('Invitation non trouvée');
    if (invitation.userId !== userId) throw new ForbiddenException('Cette invitation ne vous appartient pas');
    if (invitation.status !== 'PENDING') throw new ConflictException('Invitation déjà traitée');

    const updated = await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: dto.status },
      include: { event: { select: { id: true, title: true } } },
    });

    if (dto.status === 'ACCEPTED') {
      const existingMember = await this.prisma.eventMember.findUnique({
        where: { userId_eventId: { userId, eventId: invitation.eventId } },
      });
      if (!existingMember) {
        await this.prisma.eventMember.create({
          data: { eventId: invitation.eventId, userId, role: 'participant' },
        });
      }
    }

    return updated;
  }

  async getMyInvitations(userId: number) {
    return this.prisma.invitation.findMany({
      where: { userId },
      include: {
        event: {
          include: { owner: { select: { id: true, name: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEventInvitations(eventId: number, requesterId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Événement non trouvé');
    if (event.ownerId !== requesterId) throw new ForbiddenException('Accès refusé');

    return this.prisma.invitation.findMany({
      where: { eventId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async cancelInvitation(invitationId: number, requesterId: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { event: true },
    });
    if (!invitation) throw new NotFoundException('Invitation non trouvée');
    if (invitation.event.ownerId !== requesterId) throw new ForbiddenException('Seul le créateur peut annuler');

    await this.prisma.invitation.delete({ where: { id: invitationId } });
  }
}
