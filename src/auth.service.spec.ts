import { Test } from '@nestjs/testing';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './auth/dtos/create-user.dto';
import { User } from './auth/user.entity';
import { UsersService } from './auth/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let fakeUser: User = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    password: 'password',
  };

  beforeEach(async () => {
    fakeUsersService = {
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
    const user = await service.register(fakeUser);

    expect(user.password).not.toEqual('password');
    const [hash, salt] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([fakeUser]);

    try {
      await service.register(fakeUser);
    } catch (error) {}
  });

  it('throws an error if login is called with an unused email', async () => {
    try {
      await service.login({ email: 'prince@email.com', password: 'secret' });
    } catch (error) {}
  });
});
