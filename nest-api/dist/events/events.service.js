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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, ownerId) {
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
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                owner: { select: { id: true, email: true, name: true } },
                members: { include: { user: { select: { id: true, email: true, name: true } } } },
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        return event;
    }
    async update(id, dto, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        if (event.ownerId !== userId)
            throw new common_1.ForbiddenException('Seul le créateur peut modifier');
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
    async remove(id, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Événement non trouvé');
        if (event.ownerId !== userId)
            throw new common_1.ForbiddenException('Seul le créateur peut supprimer');
        await this.prisma.event.delete({ where: { id } });
    }
    async findMyEvents(userId) {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map