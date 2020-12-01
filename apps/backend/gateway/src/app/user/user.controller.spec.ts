import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, reset, when } from 'ts-mockito';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controllerUnderTest: UserController;

  const mockedService = mock(UserService);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: instance(mockedService) }],
    }).compile();

    controllerUnderTest = app.get<UserController>(UserController);
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('root', () => {
    it('should return "Hi there!"', () => {
      when(mockedService.getHello()).thenReturn(
        new Promise<string>((resolve) => {
          resolve('Hello World!');
        }),
      );
      expect(controllerUnderTest.getHello()).toBe('Hi there!');
    });
  });
});
