import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReigsterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(registerDto: ReigsterDto) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: registerDto.email },
      });

      if (user) {
        throw new ConflictException('Email already taken!');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );

      const newUser = await this.prismaService.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          fullName: registerDto.fullName,
        },
      });

      this.logger.log(`New user has been created: ${newUser.id}`);

      const payload = { sub: newUser.id, email: newUser.email };

      const accessToken = await this.jwtService.signAsync(payload);

      await this.prismaService.user.update({
        where: { id: newUser.id },
        data: { refreshToken: accessToken },
      });

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new ConflictException('Invalid credentials!');
      }

      const payload = { sub: user.id, email: user.email };

      const accessToken = await this.jwtService.signAsync(payload);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { refreshToken: accessToken },
      });

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async findById(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      const {
        password,
        refreshToken,
        resetToken,
        resetTokenExpiry,
        ...result
      } = user;

      return result;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async logout(userId: string) {
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      return { message: 'Logout successful' };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
