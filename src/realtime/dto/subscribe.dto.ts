import { IsArray } from 'class-validator';

export class SubscribeDto {
  @IsArray({ each: true })
  readonly games: string[];
}
