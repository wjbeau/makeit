import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, reset, when } from 'ts-mockito';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserAccount } from '@makeit/types';

describe('AuthService', () => {
  let controllerUnderTest: AuthService;

  const mockedJwtService = mock(JwtService);
  const mockedUserService = mock(UserService);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: instance(mockedJwtService) },
        { provide: UserService, useValue: instance(mockedUserService) },
      ],
    }).compile();

    controllerUnderTest = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    reset(mockedJwtService)
    reset(mockedUserService)
  });

  describe('login', () => {
    it('should return valid JWT', async () => {
      const user = {
        userId: 'uid',
        firstName: 'fname',
        lastName: 'lname',
        profiles: []
      }
      when(mockedJwtService.sign(user)).thenReturn('test_jwt');
      const result = await controllerUnderTest.login(user);
      expect(result).toBeDefined();
      expect(result.access_token).toEqual('test_jwt')
      expect(result.user).toEqual(user)
    });
  });

  describe('validateUser', () => {
    it('should return valid user when found and passwords match', async () => {
      const username = 'john'
      const password = 'passwd'
      const user = {
        userId: username,
        firstName: 'fname',
        lastName: 'lname',
        password: password,
        profiles: []
      }
      when(mockedUserService.findById(username)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(user) }));
      const result = await controllerUnderTest.validateUser(username, password);
      expect(result).toBeDefined();
      expect(result.userId).toEqual(user.userId)
      expect(result.firstName).toEqual(user.firstName)
      expect(result.lastName).toEqual(user.lastName)
      expect(result.profiles).toEqual(user.profiles)
      expect(result.password).toBeUndefined()
    });

    it('should return null when passwords mismatch', async () => {
      const username = 'john'
      const password = 'passwd'
      const user = {
        userId: username,
        firstName: 'fname',
        lastName: 'lname',
        password: 'otherpassword',
        profiles: []
      }
      when(mockedUserService.findById(username)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(user) }));
      const result = await controllerUnderTest.validateUser(username, password);
      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      const username = 'john'
      const password = 'passwd'
      when(mockedUserService.findById(username)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(null) }));
      const result = await controllerUnderTest.validateUser(username, password);
      expect(result).toBeNull();
    });
  });
});
