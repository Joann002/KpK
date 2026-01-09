"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMembersModule = void 0;
const common_1 = require("@nestjs/common");
const event_members_controller_1 = require("./event-members.controller");
const event_members_service_1 = require("./event-members.service");
let EventMembersModule = class EventMembersModule {
};
exports.EventMembersModule = EventMembersModule;
exports.EventMembersModule = EventMembersModule = __decorate([
    (0, common_1.Module)({
        controllers: [event_members_controller_1.EventMembersController],
        providers: [event_members_service_1.EventMembersService],
    })
], EventMembersModule);
//# sourceMappingURL=event-members.module.js.map