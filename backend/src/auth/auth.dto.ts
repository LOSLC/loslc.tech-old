import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Expose } from "class-transformer";

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
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsNotEmpty()
  fullName: string;

  @Expose()
  @MinLength(8)
  password: string;

  @Expose()
  @MinLength(8)
  confirmPassword: string;
}

export class LoginDTO implements LoginDTOInterface {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @MinLength(8)
  password: string;
}

export class OtpVerificationDTO implements OtpVerificationDTOInterface {
  @Expose()
  @IsNotEmpty()
  token: string;
}

export class AccountVerificationDTO implements AccountVerificationDTOInterface {
  @Expose()
  @IsNotEmpty()
  authSessionId: string;

  @Expose()
  @IsNotEmpty()
  authSessionToken: string;
}

export class PasswordResetRequestDTO
  implements PasswordResetRequestDTOInterface
{
  @Expose()
  @IsEmail()
  email: string;
}

export class PasswordResetDTO implements PasswordResetDTOInterface {
  @Expose()
  @IsNotEmpty()
  sessionId: string;

  @Expose()
  @IsNotEmpty()
  token: string;

  @Expose()
  @MinLength(8)
  newPassword: string;

  @Expose()
  @MinLength(8)
  confirmNewPassword: string;
}
