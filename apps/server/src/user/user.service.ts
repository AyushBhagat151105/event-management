import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReigsterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(registerDto: ReigsterDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new ConflictException('Email already taken!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const newUser = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
      },
    });

    this.logger.log(`New user has been created: ${newUser.id}`);

    const payload = { sub: newUser.id, email: newUser.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
