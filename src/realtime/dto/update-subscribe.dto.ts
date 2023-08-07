import { PartialType } from '@nestjs/mapped-types';
import { SubscribeDto } from './subscribe.dto';

export class UpdateSubscribeDto extends PartialType(SubscribeDto) {}
