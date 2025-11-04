import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { ErrorCodes } from 'src/shared/error-codes';
import { MailService } from '../mail/mail.service';
import { SessionService } from '../session/session.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AUTH_CONSTANTS } from './auth.constants';
import { AuthLoginDto } from './dto/login';
import { AuthRegisterDto } from './dto/register';
import { AuthResetPasswordDto } from './dto/reset-password';
import { AuthResetPasswordConfirmDto } from './dto/reset-password-confirm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(body: AuthRegisterDto) {
    body.email = body.email.toLowerCase();

    let user = await this.userService.getUserByEmail(body.email);
    if (user) {
      throw new BadRequestException(ErrorCodes.USER_ALREADY_EXISTS);
    }

    user = await this.userService.createUser({
      email: body.email,
      password: await this.hashPassword(body.password),
    });

    const tokens = await this.generateTokenPair(user);

    return {
      user: user.toAPI(),
      ...tokens,
    };
  }

  public async login(body: AuthLoginDto) {
    body.email = body.email.toLowerCase();

    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }

    const isPasswordValid = await this.comparePassword(
      body.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(ErrorCodes.INVALID_PASSWORD);
    }

    const tokens = await this.generateTokenPair(user);

    return {
      user: user.toAPI(),
      ...tokens,
    };
  }

  public async refresh(email: string, sessionId: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      throw new BadRequestException(ErrorCodes.INVALID_REFRESH_TOKEN);
    }

    const [tokens] = await Promise.all([
      this.generateTokenPair(user),
      this.sessionService.deleteSession(sessionId),
    ]);

    return tokens;
  }

  public async resetPassword(body: AuthResetPasswordDto) {
    body.email = body.email.toLowerCase();

    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }

    const ttl = await this.redis.pttl(`rp:${user.id}`);
    if (ttl > AUTH_CONSTANTS.RESET_PASSWORD_CODE_EXPIRATION_TIME - 60 * 1000) {
      throw new BadRequestException(ErrorCodes.CODE_ALREDY_SENT);
    }

    const code = Math.random()
      .toString(36)
      .slice(-AUTH_CONSTANTS.RESET_PASSWORD_CODE_LENGTH)
      .toUpperCase();

    await this.redis.psetex(
      `rp:${user.id}`,
      AUTH_CONSTANTS.RESET_PASSWORD_CODE_EXPIRATION_TIME,
      code,
    );

    await this.mailService.sendResetPassword(body.email, code);
  }

  public async resetPasswordConfirm(body: AuthResetPasswordConfirmDto) {
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }

    const code = await this.redis.get(`rp:${user.id}`);
    if (!code) {
      throw new BadRequestException(ErrorCodes.CODE_EXPIRED);
    }

    if (code !== body.code) {
      throw new BadRequestException(ErrorCodes.INVALID_CODE);
    }

    await this.userService.updateUser(user.id, {
      password: await this.hashPassword(body.password),
    });

    await this.redis.del(`rp:${user.id}`);
  }

  public async logout(sessionId: string) {
    return this.sessionService.deleteSession(sessionId);
  }

  private async generateTokenPair(user: Pick<User, 'id' | 'email'>) {
    const sessionId = randomUUID();
    const payload = { id: user.id, email: user.email, sessionId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: AUTH_CONSTANTS.JWT_ACCESS_EXPIRATION_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: AUTH_CONSTANTS.JWT_REFRESH_EXPIRATION_TIME,
      }),
      this.sessionService.createSession(
        { id: sessionId },
        AUTH_CONSTANTS.JWT_REFRESH_EXPIRATION_TIME,
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string) {
    return hash(password, 10);
  }

  private async comparePassword(value: string, password: string) {
    return compare(value, password);
  }
}
