import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ReigsterDto } from './dto/register.dto';
import { LoginDto } from './dto/Login.dto';
import { UserGuard } from './user.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request.interface.ts';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerDto: ReigsterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(UserGuard)
  @Post('logout')
  logout(@Request() req: AuthenticatedRequest) {
    return this.userService.logout(req.user.sub);
  }

  @UseGuards(UserGuard)
  @Get('me')
  me(@Request() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.sub);
  }
}
