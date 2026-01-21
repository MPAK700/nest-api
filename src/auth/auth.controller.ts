import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service.ts';
import { ProfileCreateDTO } from '../features/profile/dto/profile-create.dto.ts';
import { SignInDTO } from '../features/profile/dto/sign-in.dto.ts';
import { SignInResponseDTO } from './dto/sign-in-response.dto.ts';
import { JwtRefreshGuard } from './guard/refresh.guard.ts';
import { GetUser } from '../common/decorator/get-user.decorator.ts';
import type { RefreshUser } from './types/refresh-user.type.ts';
import { plainToInstance } from 'class-transformer';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async ignUp(@Body() profile: ProfileCreateDTO): Promise<SignInResponseDTO> {
    const tokens = await this.authService.signUp(profile);
    return plainToInstance(SignInResponseDTO, tokens);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() profile: SignInDTO): Promise<SignInResponseDTO> {
    const tokens = await this.authService.signIn(profile);
    return plainToInstance(SignInResponseDTO, tokens);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @GetUser<RefreshUser>() user: RefreshUser,
  ): Promise<SignInResponseDTO> {
    const tokens = await this.authService.rotateTokens(user);
    return plainToInstance(SignInResponseDTO, tokens);
  }
}
