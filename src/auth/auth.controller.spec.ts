import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockUsersService: Partial<UsersService>;
  let fakeUser: CreateUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    password: 'secret',
  };
  let fakeReturnedUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    password: 'secret',
  };

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
    };
    mockAuthService = {
      register: (dto: CreateUserDto) => Promise.resolve({ id: 1, ...dto }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const user = await mockAuthService.register(fakeUser);
    expect(user).toBeDefined();
  });

  it('throws an error if email already in use', async () => {
    mockUsersService.find = () => Promise.resolve([fakeReturnedUser]);

    try {
      await mockAuthService.register(fakeUser);
    } catch (error) {
      expect(error.message).toBe('');
    }
  });
});
