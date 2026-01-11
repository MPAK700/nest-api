import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service.ts"
import { ProfileDTO } from "../profile/dto/profile.dto.ts"
import { SignInDTO } from "../profile/dto/sign-in.dto.ts";
import { SignInResponseDTO } from "./dto/sign-in-response.dto.ts";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signUp(@Body() profile: ProfileDTO): Promise<SignInResponseDTO> {
        return this.authService.signUp(profile);
    }

    @Post('signin')
    signIn(@Body() profile: SignInDTO): Promise<SignInResponseDTO> {
        return this.authService.signIn(profile)
    }
}