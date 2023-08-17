import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameEntity } from './game.entity';

@Entity()
@Index(['hashedEmail', 'id'])
@Expose()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Exclude()
  @Column({ unique: true })
  readonly email: string;

  @Exclude()
  @Column({ unique: true })
  readonly hashedEmail: string;

  @Exclude()
  @Column({ nullable: true })
  readonly refreshToken: string;

  @Exclude()
  @Column({ default: null })
  readonly password: string;

  @Exclude()
  @Column({ unique: true })
  readonly phoneNumber: string;

  @ManyToMany(() => GameEntity, (game: GameEntity) => game.users)
  @JoinTable()
  readonly games: GameEntity[];
}
