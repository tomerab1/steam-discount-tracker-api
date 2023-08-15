import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly hashedEmail: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber: string;
}
