import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ReigsterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerDto: ReigsterDto) {
    return this.userService.register(registerDto);
  }
}
