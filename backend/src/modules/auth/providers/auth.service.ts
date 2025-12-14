import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User, UserRole } from '@/entities/user.entity';
import { Company } from '@/entities/company.entity';
import { RegisterDto } from '../dtos/register.dto';

export interface TokenPayload {
  sub: number;
  email: string;
  name: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async signTokens(user: User): Promise<Tokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.displayName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Store hashed refresh token
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userRepo.update(user.id, { refreshToken: hashedRefreshToken });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await argon2.verify(user.refreshToken, refreshToken);
      
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.signTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: null });
  }

  async register(dto: RegisterDto): Promise<Tokens> {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingCompany = await this.companyRepo.findOne({ where: { name: dto.companyName } });
    if (existingCompany) {
      throw new ConflictException('Company with this name already exists');
    }

    const company = this.companyRepo.create({
      name: dto.companyName,
    });
    const savedCompany = await this.companyRepo.save(company);

    const passwordHash = await argon2.hash(dto.password);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      displayName: `${dto.firstName} ${dto.lastName}`,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: UserRole.ADMIN,
      companyId: savedCompany.id,
      isActive: true,
    });

    const savedUser = await this.userRepo.save(user);

    return this.signTokens(savedUser);
  }

  buildUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    };
  }
}
