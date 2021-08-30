import { Test } from '@nestjs/testing';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './auth/dtos/create-user.dto';
import { User } from './auth/user.entity';
import { UsersService } from './auth/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (body: CreateUserDto) =>
        Promise.resolve({ id: 1, ...body } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.register({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      password: 'password',
    });

    expect(user.password).not.toEqual('password');
    const [hash, salt] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });
});
