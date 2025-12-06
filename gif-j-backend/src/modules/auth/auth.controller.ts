import { Body, Controller, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { UserParam } from './auth.decorators';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login';
import { AuthRegisterDto } from './dto/register';
import { AuthResetPasswordDto } from './dto/reset-password';
import { AuthResetPasswordConfirmDto } from './dto/reset-password-confirm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Recaptcha({ action: 'register' })
  @Post('register')
  public async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
  public async login(@Body() body: AuthLoginDto) {
    console.log('Login endpoint hit!', { email: body.email });
    try {
      const result = await this.authService.login(body);
      console.log('Login service returned:', result ? 'success' : 'null');
      return result;
    } catch (error) {
      console.error('Login error in controller:', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  public async refresh(
    @UserParam('email') email: string,
    @UserParam('sessionId') sessionId: string,
  ) {
    return this.authService.refresh(email, sessionId);
  }

  @Post('reset-password')
  public async resetPassword(@Body() body: AuthResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @Post('reset-password-confirm')
  public async resetPasswordConfirm(@Body() body: AuthResetPasswordConfirmDto) {
    return this.authService.resetPasswordConfirm(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  public async logout(@UserParam('sessionId') sessionId: string) {
    return this.authService.logout(sessionId);
  }
}
