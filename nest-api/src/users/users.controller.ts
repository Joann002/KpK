import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Req, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getMe(@Req() req: { user: { id: number } }) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: { user: { id: number } },
  ) {
    if (req.user.id !== id) throw new ForbiddenException('Vous ne pouvez modifier que votre profil');
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    if (req.user.id !== id) throw new ForbiddenException('Vous ne pouvez supprimer que votre compte');
    return this.usersService.remove(id);
  }
}
