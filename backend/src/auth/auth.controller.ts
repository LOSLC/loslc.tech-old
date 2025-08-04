import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import {
  RegisterDTO,
  LoginDTO,
  OtpVerificationDTO,
  PasswordResetRequestDTO,
  PasswordResetDTO,
  AccountVerificationDTO,
} from "./auth.dto";
import { Message } from "@/common/dto/message";
import { Cookies } from "@/common/decorators/cookies.decorator";
import { OTP_SESSION_COOKIE_NAME } from "./auth.config";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({
    type: RegisterDTO,
    examples: {
      example1: {
        summary: "User registration example",
        value: {
          email: "john.doe@example.com",
          username: "johndoe",
          fullName: "John Doe",
          password: "SecurePassword123!",
          confirmPassword: "SecurePassword123!"
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDTO): Promise<Message> {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiBody({
    type: LoginDTO,
    examples: {
      example1: {
        summary: "User login example",
        value: {
          email: "john.doe@example.com",
          password: "SecurePassword123!"
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiResponse({ status: 403, description: "User banned" })
  @ApiResponse({ status: 404, description: "User not found" })
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Message> {
    return await this.authService.login({ res, data: loginDto });
  }

  @Post("logout")
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  async logout(@Res({ passthrough: true }) res: Response): Promise<Message> {
    return await this.authService.logout(res);
  }

  @Post("verify-email")
  @ApiOperation({ summary: "Verify user email" })
  @ApiBody({
    type: AccountVerificationDTO,
    examples: {
      example1: {
        summary: "Email verification example",
        value: {
          authSessionId: "uuid-session-id-here",
          authSessionToken: "verification-token-here"
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "Email verified successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired token" })
  @ApiResponse({ status: 409, description: "User already verified" })
  async verifyEmail(@Body() data: AccountVerificationDTO): Promise<Message> {
    return await this.authService.verifyEmail(data);
  }

  @Post("verify-otp")
  @ApiOperation({ summary: "Verify OTP for authentication" })
  @ApiBody({
    type: OtpVerificationDTO,
    examples: {
      example1: {
        summary: "OTP verification example",
        value: {
          token: "123456"
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "Authentication successful" })
  @ApiResponse({ status: 400, description: "Invalid or expired OTP" })
  @ApiResponse({ status: 401, description: "Invalid token" })
  @ApiResponse({ status: 403, description: "User banned" })
  async verifyOtp(
    @Body() otpDto: OtpVerificationDTO,
    @Cookies(OTP_SESSION_COOKIE_NAME) otpSessionIdCookie: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Message> {
    return await this.authService.authenticate({
      res,
      data: otpDto,
      otpSessionIdCookie,
    });
  }

  @Post("resend-otp")
  @ApiOperation({ summary: "Resend OTP code" })
  @ApiResponse({ status: 200, description: "New OTP code sent successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired session" })
  async resendOtp(
    @Cookies(OTP_SESSION_COOKIE_NAME) otpSessionIdCookie: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Message> {
    const result = await this.authService.requestNewOtp({ otpSessionIdCookie });
    
    // Update the cookie with the new session ID
    if ('newSessionId' in result && result.newSessionId) {
      res.cookie(OTP_SESSION_COOKIE_NAME, result.newSessionId, {
        httpOnly: true,
        secure: process.env.DEBUG?.toLowerCase() !== "true",
        maxAge: 1000 * 60 * 5, // 5 minutes
      });
    }
    
    return {
      message: result.message
    };
  }

  @Post("request-password-reset")
  @ApiOperation({ summary: "Request password reset" })
  @ApiBody({
    type: PasswordResetRequestDTO,
    examples: {
      example1: {
        summary: "Password reset request example",
        value: {
          email: "john.doe@example.com"
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  @ApiResponse({ status: 404, description: "User not found" })
  async requestPasswordReset(
    @Body() resetRequestDto: PasswordResetRequestDTO,
  ): Promise<Message> {
    return await this.authService.requestPasswordReset(resetRequestDto);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password" })
  @ApiBody({
    type: PasswordResetDTO,
    examples: {
      example1: {
        summary: "Password reset example",
        value: {
          sessionId: "uuid-session-id-here",
          token: "reset-token-here",
          newPassword: "NewSecurePassword123!",
          confirmNewPassword: "NewSecurePassword123!"
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired reset token" })
  @ApiResponse({ status: 404, description: "User not found" })
  async resetPassword(@Body() resetDto: PasswordResetDTO): Promise<Message> {
    return await this.authService.resetPassword(resetDto);
  }

  @Get("check-email/:email")
  @ApiOperation({ summary: "Check if email exists" })
  @ApiResponse({ status: 200, description: "Email availability check" })
  async checkEmailExists(@Param("email") email: string): Promise<boolean> {
    return await this.authService.checkEmailExists(email);
  }

  @Get("check-username/:username")
  @ApiOperation({ summary: "Check if username exists" })
  @ApiResponse({ status: 200, description: "Username availability check" })
  async checkUsernameExists(
    @Param("username") username: string,
  ): Promise<boolean> {
    return await this.authService.checkUsernameExists(username);
  }
}
