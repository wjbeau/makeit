import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let classUnderTest: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    classUnderTest = module.get<UserService>(UserService);
  });

  describe('findById', () => {
    it('should return valid user', async () => {
      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById('john@test.com');
      expect(result).toBeDefined();
      expect(result.userId).toBe('john@test.com');
    });
    it('should return undefined', async () => {
      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById('nonexistent@test.com');
      expect(result).toBeUndefined();
    });
  });
});
