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
exports.EventMembersController = void 0;
const common_1 = require("@nestjs/common");
const event_members_service_1 = require("./event-members.service");
const event_member_dto_1 = require("./dto/event-member.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EventMembersController = class EventMembersController {
    constructor(membersService) {
        this.membersService = membersService;
    }
    getMembers(eventId) {
        return this.membersService.getMembers(eventId);
    }
    addMember(eventId, dto, req) {
        return this.membersService.addMember(eventId, dto, req.user.id);
    }
    join(eventId, req) {
        return this.membersService.join(eventId, req.user.id);
    }
    leave(eventId, req) {
        return this.membersService.leave(eventId, req.user.id);
    }
    updateRole(eventId, memberId, dto, req) {
        return this.membersService.updateRole(eventId, memberId, dto, req.user.id);
    }
    removeMember(eventId, memberId, req) {
        return this.membersService.removeMember(eventId, memberId, req.user.id);
    }
};
exports.EventMembersController = EventMembersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EventMembersController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, event_member_dto_1.AddMemberDto, Object]),
    __metadata("design:returntype", void 0)
], EventMembersController.prototype, "addMember", null);
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], EventMembersController.prototype, "join", null);
__decorate([
    (0, common_1.Delete)('leave'),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], EventMembersController.prototype, "leave", null);
__decorate([
    (0, common_1.Patch)(':memberId'),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, event_member_dto_1.UpdateMemberDto, Object]),
    __metadata("design:returntype", void 0)
], EventMembersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':memberId'),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], EventMembersController.prototype, "removeMember", null);
exports.EventMembersController = EventMembersController = __decorate([
    (0, common_1.Controller)('events/:eventId/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [event_members_service_1.EventMembersService])
], EventMembersController);
//# sourceMappingURL=event-members.controller.js.map