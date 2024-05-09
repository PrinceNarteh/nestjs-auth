import { AbstractEntity } from 'database/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class ApiKey extends AbstractEntity {
  @Column()
  key: string;

  @Column()
  uuid: string;

  @ManyToOne(() => User, (user) => user.apiKeys)
  user: User;
}
