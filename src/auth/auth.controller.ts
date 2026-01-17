import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { ProfileDTO } from '../profile/dto/profile.dto.ts';
import { SignInDTO } from '../profile/dto/sign-in.dto.ts';
import { SignInResponseDTO } from './dto/sign-in-response.dto.ts';
import { JwtRefreshGuard } from './guard/refresh.guard.ts';
import { GetUser } from '../common/decorator/get-user.decorator.ts';
import type { RefreshUser } from './types/refresh-user.type.ts';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() profile: ProfileDTO): Promise<SignInResponseDTO> {
    return this.authService.signUp(profile);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() profile: SignInDTO): Promise<SignInResponseDTO> {
    return this.authService.signIn(profile);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@GetUser<RefreshUser>() user: RefreshUser): Promise<SignInResponseDTO> {
    return this.authService.rotateTokens(user);
  }
}
