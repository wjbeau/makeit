import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, reset, when, anything, strictEqual } from 'ts-mockito';
import { AuditionController } from './audition.controller';
import { AuditionService } from './audition.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuditionModel } from '../../schema/audition.schema';
import { Audition, UserAccount } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';

describe('AuditionController', () => {
  let controllerUnderTest: AuditionController;

  const mockedService = mock(AuditionService);
  const mockedGuard = mock(JwtStrategy);
  const user = {
    _id: 'someid',
    email: 'uid',
    firstName: 'fname',
    lastName: 'lname',
    avatar: '',
    profiles: []
  }

  beforeEach(async () => {
    when(mockedGuard.validate(anything())).thenReturn(new Promise<UserAccount>((resolve) => { resolve(user) }));

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditionController],
      providers: [
        { provide: AuditionService, useValue: instance(mockedService) },
        { provide: JwtStrategy, useValue: instance(mockedGuard) },
      ],
    }).compile();

    controllerUnderTest = app.get<AuditionController>(AuditionController);
  });

  afterEach(() => {
    reset(mockedService);
    reset(mockedGuard);
  });

  describe('getAuditions', () => {
    it('should return auditions', async () => {
      const aud = new AuditionModel();
      const aud2 = new AuditionModel();

      const req = { user: user }

      when(mockedService.findAllForUser(strictEqual(user._id))).thenReturn(
        new Promise<Audition[]>((resolve) => { resolve([aud, aud2]) }),
      );
      const result = await controllerUnderTest.getAuditions(req)
      expect(result).toBeDefined();
      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(aud);
      expect(result[1]).toEqual(aud2);
    });
  });

  describe('getAudition', () => {
    it('should return audition', async () => {
      const aud = new AuditionModel();

      const params = { id: 'someid' }

      when(mockedService.findById(strictEqual(params.id))).thenReturn(
        new Promise<Audition>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.getAudition(params)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
  });

  describe('updateAudition', () => {
    it('should update when all is valid', async () => {
      const params = { id: 'someid' }
      const aud = new AuditionModel();
      aud['_id'] = params.id;

      when(mockedService.save(strictEqual(params.id), strictEqual(aud))).thenReturn(
        new Promise<Audition>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.updateAudition(params, aud)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const aud = new AuditionModel();
      aud['_id'] = params.id;
      const error = new BadRequestException('Nonono');

      when(mockedService.save(strictEqual(params.id), strictEqual(aud))).thenThrow(error);

      try {
        await controllerUnderTest.updateAudition(params, aud)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });

    describe('createAudition', () => {
      it('should save when all is valid', async () => {
        const aud = new AuditionModel();
  
        when(mockedService.save(strictEqual(null), strictEqual(aud))).thenReturn(
          new Promise<Audition>((resolve) => { resolve(aud) }),
        );
        const result = await controllerUnderTest.createAudition(aud)
        expect(result).toBeDefined();
        expect(result).toEqual(aud);
      });
      it('should fail when an error is thrown', async () => {
        const aud = new AuditionModel();
        const error = new BadRequestException('Nonono');
  
        when(mockedService.save(strictEqual(null), strictEqual(aud))).thenThrow(error);
  
        try {
          await controllerUnderTest.createAudition(aud)
          fail();
        } catch (e) {
          expect(e).toEqual(error); 
        }
      });
    });
  });
});
