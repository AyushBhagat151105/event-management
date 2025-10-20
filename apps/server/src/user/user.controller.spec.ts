import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGuard } from './user.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(UserGuard)
      .useValue({})
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call userService.register with strong password', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Strong@1234', // ✅ Strong password
      };
      const result = { id: 1, ...dto };
      mockUserService.register.mockResolvedValue(result);

      const response = await controller.register(dto as any);
      expect(userService.register).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call userService.login with correct dto', async () => {
      const dto = {
        email: 'john@example.com',
        password: 'Strong@1234',
      };
      const result = { token: 'jwt_token' };
      mockUserService.login.mockResolvedValue(result);

      const response = await controller.login(dto);
      expect(userService.login).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('logout', () => {
    it('should call userService.logout with user.sub', async () => {
      const req = { user: { sub: '123' } };
      const result = { message: 'Logged out successfully' };
      mockUserService.logout.mockResolvedValue(result);

      const response = await controller.logout(req as any);
      expect(userService.logout).toHaveBeenCalledWith('123');
      expect(response).toEqual(result);
    });
  });

  describe('me', () => {
    it('should call userService.findById with user.sub', async () => {
      const req = { user: { sub: '123' } };
      const result = { id: '123', name: 'John Doe' };
      mockUserService.findById.mockResolvedValue(result);

      const response = await controller.me(req as any);
      expect(userService.findById).toHaveBeenCalledWith('123');
      expect(response).toEqual(result);
    });
  });
});
