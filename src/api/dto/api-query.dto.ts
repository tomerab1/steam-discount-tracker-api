import { IsIn, IsOptional, IsString } from 'class-validator';

type MatchOptions = 'like' | 'exact';

export class ApiQueryDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsIn(['like', 'exact'], {
    message: 'matchOpt must be either "like" or "exact"',
  })
  @IsOptional({})
  readonly matchOpt: MatchOptions = 'exact';
}
