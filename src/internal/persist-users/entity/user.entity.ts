import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ unique: true })
  readonly email: string;

  @Column({ unique: true })
  readonly phoneNumber: string;

  @Column()
  readonly games: string[];
}
