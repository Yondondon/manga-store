import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly refreshCookieKey: string;
  private readonly refreshCookieTtlMs: number;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.refreshCookieKey = config.getOrThrow<string>('JWT_REFRESH_COOKIE_KEY');
    this.refreshCookieTtlMs =
      parseInt(config.getOrThrow<string>('JWT_REFRESH_TTL_SECONDS')) * 1000;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(dto);

    this.setRefreshCookie(res, refresh_token);

    return { access_token };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const token = req.cookies[this.refreshCookieKey] as string | undefined;
    return this.authService.refresh(token ?? '');
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie(this.refreshCookieKey, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(this.refreshCookieKey, token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.refreshCookieTtlMs,
    });
  }
}
