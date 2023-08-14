import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameEntity } from './game.entity';

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

  @ManyToMany(() => GameEntity, (game: GameEntity) => game.users)
  @JoinTable()
  readonly games: GameEntity[];
}
