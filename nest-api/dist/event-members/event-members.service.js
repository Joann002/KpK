"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventMembersService = class EventMembersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkEventOwner(eventId, userId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        if (event.ownerId !== userId)
            throw new common_1.ForbiddenException('Seul le créateur peut gérer les membres');
        return event;
    }
    async addMember(eventId, dto, requesterId) {
        await this.checkEventOwner(eventId, requesterId);
        const exists = await this.prisma.eventMember.findUnique({
            where: { userId_eventId: { userId: dto.userId, eventId } },
        });
        if (exists)
            throw new common_1.ConflictException('Utilisateur déjà membre');
        return this.prisma.eventMember.create({
            data: { eventId, userId: dto.userId, role: dto.role || 'participant' },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
    }
    async join(eventId, userId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        const exists = await this.prisma.eventMember.findUnique({
            where: { userId_eventId: { userId, eventId } },
        });
        if (exists)
            throw new common_1.ConflictException('Vous êtes déjà membre');
        return this.prisma.eventMember.create({
            data: { eventId, userId, role: 'participant' },
            include: { event: { select: { id: true, title: true } } },
        });
    }
    async leave(eventId, userId) {
        const member = await this.prisma.eventMember.findUnique({
            where: { userId_eventId: { userId, eventId } },
        });
        if (!member)
            throw new common_1.NotFoundException('Vous n\'êtes pas membre');
        await this.prisma.eventMember.delete({
            where: { userId_eventId: { userId, eventId } },
        });
    }
    async updateRole(eventId, memberId, dto, requesterId) {
        await this.checkEventOwner(eventId, requesterId);
        const member = await this.prisma.eventMember.findFirst({
            where: { id: memberId, eventId },
        });
        if (!member)
            throw new common_1.NotFoundException('Membre non trouvé');
        return this.prisma.eventMember.update({
            where: { id: memberId },
            data: { role: dto.role },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
    }
    async removeMember(eventId, memberId, requesterId) {
        await this.checkEventOwner(eventId, requesterId);
        const member = await this.prisma.eventMember.findFirst({
            where: { id: memberId, eventId },
        });
        if (!member)
            throw new common_1.NotFoundException('Membre non trouvé');
        await this.prisma.eventMember.delete({ where: { id: memberId } });
    }
    async getMembers(eventId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        return this.prisma.eventMember.findMany({
            where: { eventId },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
    }
};
exports.EventMembersService = EventMembersService;
exports.EventMembersService = EventMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventMembersService);
//# sourceMappingURL=event-members.service.js.map