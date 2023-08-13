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

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber: string;

  @IsArray({ each: true })
  readonly games: string[];
}
