import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber: string;

  @IsArray({ each: true })
  readonly games: string[];
}
