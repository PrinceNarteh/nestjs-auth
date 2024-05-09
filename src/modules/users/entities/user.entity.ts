import { AbstractEntity } from 'database/entities/abstract.entity';
import { Permission, PermissionType } from 'iam/authorization/permission.type';
import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { ApiKey } from 'users/api-keys/entities/api-key.entity';
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

  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];
}
