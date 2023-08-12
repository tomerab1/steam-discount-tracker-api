import { SerializeInterceptor } from './serialize.interceptor';
import * as crypto from 'crypto';
import { lastValueFrom, of } from 'rxjs';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';

@Entity()
@Expose()
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Exclude()
  @Column({ unique: true })
  readonly email: string;

  @Exclude()
  @Column({ unique: true })
  readonly phoneNumber: string;

  @Column()
  readonly games: string[];
}

describe('SerializeInterceptor', () => {
  it('should be defined', () => {
    expect(new SerializeInterceptor(UserEntity)).toBeDefined();
  });

  describe('Should exclude @Excluded properties', () => {
    it('Should exclude email and phone number from UserEntity', async () => {
      const user: UserEntity = {
        id: crypto.randomBytes(32).toString('hex'),
        email: 'test@gmail.com',
        phoneNumber: '+97254123123',
        games: ['call of duty: modern warfare 2', 'grand theft auto iv'],
      };
      const interceptor = new SerializeInterceptor(UserEntity);
      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of(user),
      });

      const result$ = interceptor.intercept(context, handler);
      const result = await lastValueFrom(result$);

      expect(result).not.toHaveProperty('email');
      expect(result).not.toHaveProperty('phoneNumber');
    });
  });
});
