import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

interface RegisterDTOInterface {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

interface LoginDTOInterface {
  email: string;
  password: string;
}

interface OtpVerificationDTOInterface {
  token: string;
}

interface AccountVerificationDTOInterface {
  authSessionId: string;
  authSessionToken: string;
}

interface PasswordResetRequestDTOInterface {
  email: string;
}

interface PasswordResetDTOInterface {
  sessionId: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export class RegisterDTO implements RegisterDTOInterface {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  fullName: string;

  @MinLength(8)
  password: string;

  @MinLength(8)
  confirmPassword: string;
}

export class LoginDTO implements LoginDTOInterface {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

export class OtpVerificationDTO implements OtpVerificationDTOInterface {
  @IsNotEmpty()
  token: string;
}

export class AccountVerificationDTO implements AccountVerificationDTOInterface {
  @IsNotEmpty()
  authSessionId: string;

  @IsNotEmpty()
  authSessionToken: string;
}

export class PasswordResetRequestDTO
  implements PasswordResetRequestDTOInterface
{
  @IsEmail()
  email: string;
}

export class PasswordResetDTO implements PasswordResetDTOInterface {
  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  token: string;

  @MinLength(8)
  newPassword: string;

  @MinLength(8)
  confirmNewPassword: string;
}
