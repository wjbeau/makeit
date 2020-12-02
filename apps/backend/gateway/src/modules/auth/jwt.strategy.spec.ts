import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let controllerUnderTest: JwtStrategy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
      ],
    }).compile();

    controllerUnderTest = app.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('returns user', async () => {
      const user = {
        email: 'uid',
        firstName: 'fname',
        lastName: 'lname',
        profiles: []
      }
      const result = await controllerUnderTest.validate(user)
      expect(result).toBeDefined();
      expect(result).toEqual(user)
    });
  });
});
