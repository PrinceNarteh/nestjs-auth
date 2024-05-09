import { AbstractEntity } from 'database/entities/abstract.entity';
import { Column, Entity } from 'typeorm';
import { Role } from 'users/enum/role.enum';

@Entity()
export class User extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;
}
