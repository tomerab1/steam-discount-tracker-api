import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsEmpty()
  readonly hashedEmail: string;

  @IsOptional()
  @IsEmpty()
  readonly refreshToken: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber: string;
}
