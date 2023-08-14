import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
@Index(['name'])
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  readonly name: string;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.games, {
    cascade: true,
  })
  readonly users: UserEntity[];
}
