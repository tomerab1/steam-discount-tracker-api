import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly dtoCtor: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next
      .handle()
      .pipe(map((target) => plainToInstance(this.dtoCtor, target)));
  }
}
