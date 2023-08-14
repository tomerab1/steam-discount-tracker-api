import { IsArray } from 'class-validator';

export class CreateGamesDto {
  @IsArray()
  readonly games: string[];
}
