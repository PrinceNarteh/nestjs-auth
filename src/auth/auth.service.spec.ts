import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let fakeUser: User = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@email.com',
    password:
      '59f12cc2ac9633132d4603c8d4caadc61efe67a33d1b88e5e405e451ca2f8ccb.381acd69bf0f23eb',
  };

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn().mockResolvedValue([]),
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
    fakeUsersService.find = jest.fn().mockResolvedValue([fakeUser]);

    try {
      await service.register(fakeUser);
    } catch (error) {}
  });

  it('throws an error if login is called with an unused email', async () => {
    try {
      await service.login({ email: 'prince@email.com', password: 'secret' });
    } catch (error) {
      expect(error.message).toBe('Invalid Credentials');
    }
  });

  it('throws an error if an invalid password is provided', async () => {
    fakeUsersService.find = jest.fn().mockResolvedValue([fakeUser]);
    try {
      await service.login({
        email: 'jane.smith@email.com',
        password: 'pass',
      });
    } catch (err) {
      expect(err.message).toBe('Invalid Credentials');
    }
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = jest.fn().mockResolvedValue([fakeUser]);

    const user = await service.login({
      email: 'jane.doe@email.com',
      password: 'password',
    });

    expect(user).toBeDefined();
  });
});
