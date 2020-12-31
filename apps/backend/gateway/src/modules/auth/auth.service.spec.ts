import { instance, mock, reset, when, strictEqual, deepEqual } from 'ts-mockito';
import { AuthService } from './auth.service';
import { UserAccount, AccessTokenType } from '@makeit/types';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CryptoService } from '../common-services/crypto.service';

describe('AuthService', () => {
  let classUnderTest: AuthService;

  const mockedJwtService = mock(JwtService);
  const mockedUserService = mock(UserService);
  const mockedCryptoService = mock(CryptoService);

  beforeEach(async () => {
    //For some reason the TestingModule.createTestingModule.compile was timing out...
    //so we just manually create the auth service on this occasion
    classUnderTest = new AuthService(
      instance(mockedCryptoService), 
      instance(mockedUserService), 
      instance(mockedJwtService));
  });

  afterEach(() => {
    reset(mockedJwtService)
    reset(mockedUserService)
    reset(mockedCryptoService)
  });

  describe('login', () => {
    it('should return valid JWT', async () => {
      const user = {
        email: 'uid',
        firstName: 'fname',
        lastName: 'lname',
        avatar: '',
        tokens: [],
        password: 'some crazy password',
        profiles: []
      }

      const refreshToken = {
        token: "refresh",
        expires: new Date(),
        type: AccessTokenType.Refresh,
      }

      when(mockedUserService.generateRefreshToken((deepEqual(user)))).thenResolve(refreshToken);

      const {avatar, password, tokens, ...rest} = user
      when(mockedJwtService.sign(deepEqual(rest), deepEqual( { expiresIn: '30m' }))).thenReturn('test_jwt');

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.login(user);
      expect(result).toBeDefined();
      expect(result.access_token.token).toEqual('test_jwt')
      expect(result.refresh_token).toEqual(refreshToken)
      expect(result.user).toEqual({avatar, ...rest})
    });
  });

  describe('validateUser', () => {
    it('should return valid user when found and passwords match', async () => {
      const username = 'john'
      const password = 'passwd'
      const user = {
        email: username,
        firstName: 'fname',
        lastName: 'lname',
        password: password,
        avatar: '',
        profiles: []
      }
      when(mockedCryptoService.compare(password, user.password)).thenReturn(
        new Promise<boolean>((resolve) => resolve(true)))
      when(mockedUserService.findByEmail(strictEqual(username))).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(user) })
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.validateUser(username, password);
      expect(result).toBeDefined();
      expect(result.email).toEqual(user.email)
      expect(result.firstName).toEqual(user.firstName)
      expect(result.lastName).toEqual(user.lastName)
      expect(result.profiles).toEqual(user.profiles)
      expect(result.password).toBeUndefined()
    });

    it('should return null when passwords mismatch', async () => {
      const username = 'john'
      const password = 'passwd'
      const user = {
        email: username,
        firstName: 'fname',
        lastName: 'lname',
        password: 'otherpassword',
        avatar: '',
        profiles: []
      }
      when(mockedUserService.findByEmail(username)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(user) })
      );
      
      expect(classUnderTest).toBeDefined()
      const result = await classUnderTest.validateUser(username, password);
      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      const username = 'john'
      const password = 'passwd'
      when(mockedUserService.findByEmail(username)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(null) })
      );

      expect(classUnderTest).toBeDefined()
      const result = await classUnderTest.validateUser(username, password);
      expect(result).toBeNull();
    });
  });
});
