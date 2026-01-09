import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto, ownerId: number) {
    return this.prisma.event.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        ownerId,
      },
      include: { owner: { select: { id: true, email: true, name: true } } },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        owner: { select: { id: true, email: true, name: true } },
        _count: { select: { members: true } },
      },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: { include: { user: { select: { id: true, email: true, name: true } } } },
      },
    });
    if (!event) throw new NotFoundException('Événement non trouvé');
    return event;
  }

  async update(id: number, dto: UpdateEventDto, userId: number) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Événement non trouvé');
    if (event.ownerId !== userId) throw new ForbiddenException('Seul le créateur peut modifier');

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: { owner: { select: { id: true, email: true, name: true } } },
    });
  }

  async remove(id: number, userId: number) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Événement non trouvé');
    if (event.ownerId !== userId) throw new ForbiddenException('Seul le créateur peut supprimer');

    await this.prisma.event.delete({ where: { id } });
  }

  async findMyEvents(userId: number) {
    return this.prisma.event.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        _count: { select: { members: true } },
      },
    });
  }
}
