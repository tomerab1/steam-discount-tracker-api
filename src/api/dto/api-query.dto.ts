import { IsNotEmpty, IsString } from 'class-validator';

export class ApiQueryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
