import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@Expose()
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ unique: true })
  readonly username: string;

  @Exclude()
  @Column({ unique: true })
  readonly email: string;

  @Exclude()
  @Column()
  readonly password: string;

  @Exclude()
  @Column({ unique: true })
  readonly phoneNumber: string;

  @Column('text', { array: true })
  readonly games: string[];
}
