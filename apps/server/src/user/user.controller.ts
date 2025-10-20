import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { ReigsterDto } from './dto/register.dto';
import { LoginDto } from './dto/Login.dto';

import { UserGuard } from './user.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request.interface.ts';
import {
  AuthResponseDto,
  LogoutResponseDto,
  UserProfileResponseDto,
} from './dto/user-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns an access token for immediate authentication',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully and access token generated',
    type: AuthResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email is already registered',
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data',
  })
  register(@Body() registerDto: ReigsterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user with email and password, returns an access token',
  })
  @ApiOkResponse({
    description: 'Login successful, access token generated',
    type: AuthResponseDto,
  })
  @ApiConflictResponse({
    description: 'Invalid credentials provided',
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User logout',
    description:
      'Logs out the authenticated user by invalidating their refresh token',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @ApiConflictResponse({
    description: 'Failed to logout user',
  })
  logout(@Request() req: AuthenticatedRequest) {
    return this.userService.logout(req.user.sub);
  }

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile information of the authenticated user (excludes sensitive data like password and tokens)',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated or token is invalid',
  })
  @ApiConflictResponse({
    description: 'Failed to fetch user profile',
  })
  me(@Request() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.sub);
  }
}
