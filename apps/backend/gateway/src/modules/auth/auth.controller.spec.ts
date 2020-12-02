import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, reset, when, notNull } from 'ts-mockito';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('AuthController', () => {
  let controllerUnderTest: AuthController;

  const mockedService = mock(AuthService);
  const mockedGuard = mock(LocalStrategy);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: instance(mockedService) },
        { provide: LocalStrategy, useValue: instance(mockedGuard) },
      ],
    }).compile();

    controllerUnderTest = app.get<AuthController>(AuthController);
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('login', () => {
    it('should call login"', async () => {
      const user = {
        userId: 'uid',
        firstName: 'fname',
        lastName: 'lname',
        profiles: []
      }
      when(mockedService.login(notNull())).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve({
            access_token: 'test',
            user: user
          })
        }),
      );
      const result = await controllerUnderTest.login({ user: user })
      expect(result).toBeDefined();
      expect(result.access_token).toEqual('test')
    });
  });
});
