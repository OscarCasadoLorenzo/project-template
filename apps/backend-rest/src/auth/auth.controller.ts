import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description:
      "User successfully registered. Returns access token and user info.",
  })
  @ApiResponse({
    status: 409,
    description: "User with this email already exists.",
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  @ApiResponse({
    status: 200,
    description:
      "User successfully authenticated. Returns access token and user info with role.",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials.",
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user information" })
  @ApiResponse({
    status: 200,
    description: "Returns the current user information including role.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token.",
  })
  async getMe(@Request() req) {
    return {
      user: req.user,
    };
  }
}
