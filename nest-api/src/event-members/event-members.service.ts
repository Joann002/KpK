import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto, UpdateMemberDto } from './dto/event-member.dto';

@Injectable()
export class EventMembersService {
  constructor(private prisma: PrismaService) {}

  private async checkEventOwner(eventId: number, userId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Événement non trouvé');
    if (event.ownerId !== userId) throw new ForbiddenException('Seul le créateur peut gérer les membres');
    return event;
  }

  async addMember(eventId: number, dto: AddMemberDto, requesterId: number) {
    await this.checkEventOwner(eventId, requesterId);

    const exists = await this.prisma.eventMember.findUnique({
      where: { userId_eventId: { userId: dto.userId, eventId } },
    });
    if (exists) throw new ConflictException('Utilisateur déjà membre');

    return this.prisma.eventMember.create({
      data: { eventId, userId: dto.userId, role: dto.role || 'participant' },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async join(eventId: number, userId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Événement non trouvé');

    const exists = await this.prisma.eventMember.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (exists) throw new ConflictException('Vous êtes déjà membre');

    return this.prisma.eventMember.create({
      data: { eventId, userId, role: 'participant' },
      include: { event: { select: { id: true, title: true } } },
    });
  }

  async leave(eventId: number, userId: number) {
    const member = await this.prisma.eventMember.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!member) throw new NotFoundException('Vous n\'êtes pas membre');

    await this.prisma.eventMember.delete({
      where: { userId_eventId: { userId, eventId } },
    });
  }

  async updateRole(eventId: number, memberId: number, dto: UpdateMemberDto, requesterId: number) {
    await this.checkEventOwner(eventId, requesterId);

    const member = await this.prisma.eventMember.findFirst({
      where: { id: memberId, eventId },
    });
    if (!member) throw new NotFoundException('Membre non trouvé');

    return this.prisma.eventMember.update({
      where: { id: memberId },
      data: { role: dto.role },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async removeMember(eventId: number, memberId: number, requesterId: number) {
    await this.checkEventOwner(eventId, requesterId);

    const member = await this.prisma.eventMember.findFirst({
      where: { id: memberId, eventId },
    });
    if (!member) throw new NotFoundException('Membre non trouvé');

    await this.prisma.eventMember.delete({ where: { id: memberId } });
  }

  async getMembers(eventId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Événement non trouvé');

    return this.prisma.eventMember.findMany({
      where: { eventId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }
}
