import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Expose()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

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
