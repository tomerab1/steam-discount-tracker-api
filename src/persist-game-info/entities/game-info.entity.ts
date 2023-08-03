import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['appid', 'name'])
export class GameInfoEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly name: string;

  @Column({ unique: true })
  readonly appid: number;
}
