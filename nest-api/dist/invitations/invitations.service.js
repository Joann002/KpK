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
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvitationsService = class InvitationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async invite(eventId, dto, requesterId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        if (event.ownerId !== requesterId)
            throw new common_1.ForbiddenException('Seul le créateur peut inviter');
        const existingInvite = await this.prisma.invitation.findUnique({
            where: { userId_eventId: { userId: dto.userId, eventId } },
        });
        if (existingInvite)
            throw new common_1.ConflictException('Invitation déjà envoyée');
        const existingMember = await this.prisma.eventMember.findUnique({
            where: { userId_eventId: { userId: dto.userId, eventId } },
        });
        if (existingMember)
            throw new common_1.ConflictException('Utilisateur déjà membre');
        return this.prisma.invitation.create({
            data: { eventId, userId: dto.userId, message: dto.message },
            include: {
                user: { select: { id: true, email: true, name: true } },
                event: { select: { id: true, title: true } },
            },
        });
    }
    async rsvp(invitationId, dto, userId) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { id: invitationId },
            include: { event: true },
        });
        if (!invitation)
            throw new common_1.NotFoundException('Invitation non trouvée');
        if (invitation.userId !== userId)
            throw new common_1.ForbiddenException('Cette invitation ne vous appartient pas');
        if (invitation.status !== 'PENDING')
            throw new common_1.ConflictException('Invitation déjà traitée');
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
    async getMyInvitations(userId) {
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
    async getEventInvitations(eventId, requesterId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        if (event.ownerId !== requesterId)
            throw new common_1.ForbiddenException('Accès refusé');
        return this.prisma.invitation.findMany({
            where: { eventId },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
    }
    async cancelInvitation(invitationId, requesterId) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { id: invitationId },
            include: { event: true },
        });
        if (!invitation)
            throw new common_1.NotFoundException('Invitation non trouvée');
        if (invitation.event.ownerId !== requesterId)
            throw new common_1.ForbiddenException('Seul le créateur peut annuler');
        await this.prisma.invitation.delete({ where: { id: invitationId } });
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map