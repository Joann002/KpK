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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const invitations_service_1 = require("./invitations.service");
const invitation_dto_1 = require("./dto/invitation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let InvitationsController = class InvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    invite(eventId, dto, req) {
        return this.invitationsService.invite(eventId, dto, req.user.id);
    }
    getEventInvitations(eventId, req) {
        return this.invitationsService.getEventInvitations(eventId, req.user.id);
    }
    cancel(id, req) {
        return this.invitationsService.cancelInvitation(id, req.user.id);
    }
    getMyInvitations(req) {
        return this.invitationsService.getMyInvitations(req.user.id);
    }
    rsvp(id, dto, req) {
        return this.invitationsService.rsvp(id, dto, req.user.id);
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)('events/:eventId/invitations'),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, invitation_dto_1.InviteDto, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "invite", null);
__decorate([
    (0, common_1.Get)('events/:eventId/invitations'),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "getEventInvitations", null);
__decorate([
    (0, common_1.Delete)('invitations/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('invitations/my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "getMyInvitations", null);
__decorate([
    (0, common_1.Post)('invitations/:id/rsvp'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, invitation_dto_1.RsvpDto, Object]),
    __metadata("design:returntype", void 0)
], InvitationsController.prototype, "rsvp", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map