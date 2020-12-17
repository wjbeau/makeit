import { Audition } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { instance, mock, reset, strictEqual, when } from 'ts-mockito';
import { AuditionModel } from '../../schema/audition.schema';
import { AuditionController } from './audition.controller';
import { AuditionService } from './audition.service';

describe('AuditionController', () => {
  let controllerUnderTest: AuditionController;

  const mockedService = mock(AuditionService);
  const user = {
    _id: 'someid',
    email: 'uid',
    firstName: 'fname',
    lastName: 'lname',
    avatar: '',
    profiles: []
  }

  beforeEach(async () => {
    const mockedServiceInstance = instance(mockedService);

    controllerUnderTest = new AuditionController(mockedServiceInstance)
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('getAuditions', () => {
    it('should return auditions', async () => {
      const aud = new AuditionModel();
      const aud2 = new AuditionModel();

      const req = { user: user }

      when(mockedService.findAllForUser(strictEqual(user._id))).thenReturn(
        new Promise<Audition[]>((resolve) => { resolve([aud, aud2]) }),
      );
      expect(controllerUnderTest).toBeDefined();
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
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(aud), strictEqual(user._id))).thenReturn(
        new Promise<Audition>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.updateAudition(params, aud, req)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const aud = new AuditionModel();
      aud['_id'] = params.id;
      const error = new BadRequestException('Nonono');
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(aud), strictEqual(user._id))).thenThrow(error);

      try {
        await controllerUnderTest.updateAudition(params, aud, req)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });

    describe('createAudition', () => {
      it('should save when all is valid', async () => {
        const aud = new AuditionModel();
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(aud), strictEqual(user._id))).thenReturn(
          new Promise<Audition>((resolve) => { resolve(aud) }),
        );
        const result = await controllerUnderTest.createAudition(aud, req)
        expect(result).toBeDefined();
        expect(result).toEqual(aud);
      });
      it('should fail when an error is thrown', async () => {
        const aud = new AuditionModel();
        const error = new BadRequestException('Nonono');
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(aud), strictEqual(user._id))).thenThrow(error);
  
        try {
          await controllerUnderTest.createAudition(aud, req)
          fail();
        } catch (e) {
          expect(e).toEqual(error); 
        }
      });
    });
  });
});
