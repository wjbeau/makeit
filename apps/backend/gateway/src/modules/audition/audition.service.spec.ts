import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  anything,
  deepEqual,
  instance,
  mock,
  reset,
  strictEqual,
  verify,
  when,
} from 'ts-mockito';
import { MockableDocumentQuery, MockableModel } from '../../test/mockables';
import { AuditionModel } from '../../schema/Audition.schema';
import { AuditionService } from './Audition.service';
import {
  Audition,
  AuditionStatus,
  AuditionType,
  Breakdown,
  ParticipantType,
  ReferenceType,
} from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { BreakdownService } from '../breakdown/breakdown.service';

describe('AuditionService', () => {
  let classUnderTest: AuditionService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockBreakdownService = mock(BreakdownService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditionService,
        {
          provide: BreakdownService,
          useValue: instance(mockBreakdownService),
        },
        {
          provide: getModelToken(AuditionModel.name),
          useValue: instance(mockModel),
        },
      ],
    }).compile();

    classUnderTest = module.get<AuditionService>(AuditionService);
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockBreakdownService);
  });

  describe('save', () => {
    it('should return valid Audition when properly updated', async () => {
      const audition: Audition = {
        _id: 'auditionid',
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        new Promise<Audition>((resolve) => {
          resolve(audition);
        })
      );
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: audition._id}),
          deepEqual(audition),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(audition._id, audition);
      verify(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: audition._id}),
          deepEqual(audition),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).once();
      expect(result).toEqual(audition);
    });

    it('should return valid Audition when properly updated with a breakdown', async () => {
      const audition: Audition = {
        _id: 'auditionid',
        type: AuditionType.InPersonAudition,
        breakdown: {
          _id: 'someid'
        },
        status: AuditionStatus.Accepted,
      };

      when(mockBreakdownService.save(
        strictEqual(audition.breakdown._id),
        deepEqual(audition.breakdown),
      )).thenReturn(
        new Promise<Breakdown>((resolve) => {
          resolve(audition.breakdown);
        }));

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        new Promise<Audition>((resolve) => {
          resolve(audition);
        })
      );
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: audition._id}),
          deepEqual(audition),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(audition._id, audition);
      verify(mockModel.findByIdAndUpdate(
        deepEqual({_id: audition._id}),
        deepEqual(audition),
        deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
      )).once();
      verify(mockBreakdownService.save(
        strictEqual(audition.breakdown._id),
        deepEqual(audition.breakdown),
      )).once();
      expect(result).toEqual(audition);
    });

    it('should return valid Audition when properly inserted', async () => {
      const audition: Audition = {
        _id: null,
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(audition);
        })
      );
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(
        mockModel.findByIdAndUpdate(
          deepEqual(anything()),
          deepEqual(audition),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(audition._id, audition);
      verify(
        mockModel.findByIdAndUpdate(
          deepEqual(anything()),
          deepEqual(audition),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).once();
      expect(result).toEqual(audition);
    });

    it('should throw error when ids arent a match', async () => {
      const audition: Audition = {
        _id: 'auditionid',
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', audition);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding audition', async () => {
      const audition: Audition = {
        _id: 'auditionid',
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, audition);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new audition', async () => {
      const audition: Audition = {
        _id: null,
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', audition);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const audition: Audition = {
        _id: 'auditionid',
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      const err = new Error('database problem!');
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenThrow(err);
      when(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: audition._id}),
          deepEqual(audition),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(audition._id, audition);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });

  describe('findById', () => {
    it('should return valid Audition when found', async () => {
      const audition: Audition = {
        _id: 'auditionid',
        type: AuditionType.InPersonAudition,
        breakdown: null,
        status: AuditionStatus.Accepted,
      };

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(audition);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: audition._id }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(audition._id);
      expect(result).toEqual(audition);
    });
    it('should return null Audition when not found', async () => {
      const id = 'someid';
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: id }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(id);
      expect(result).toBeNull();
    });

    it('should throw error when db error occurs', async () => {
      const id = 'some_id';
      const err = new Error('database problem!');
      when(mockModel.findOne(deepEqual({ _id: id }))).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findById(id);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });

  describe('findAllForUser', () => {
    it('should return valid Auditions when found', async () => {
      const id = 'someid';
      const auditions: Audition[] = [
        {
          _id: 'auditionid1',
          type: AuditionType.InPersonAudition,
          breakdown: null,
          status: AuditionStatus.Accepted,
        },
        {
          _id: 'auditionid2',
          type: AuditionType.InPersonAudition,
          breakdown: null,
          status: AuditionStatus.Accepted,
        },
      ];

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(auditions);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            'participants.referenceType': ReferenceType.UserAccount,
            'participants.reference': id,
            'participants.roleType': {
              $in: [
                ParticipantType.Performer,
                ParticipantType.AgentManager,
                ParticipantType.CastingAssociate,
                ParticipantType.CastingDirector,
                ParticipantType.Producer,
                ParticipantType.Director,
              ],
            },
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id);
      expect(result).toEqual(auditions);

      verify(mockQuery.populate(anything())).once();
      verify(mockQuery.exec()).once();
    });
    it('should return null Audition when not found', async () => {
      const id = 'someid';
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            'participants.referenceType': ReferenceType.UserAccount,
            'participants.reference': id,
            'participants.roleType': {
              $in: [
                ParticipantType.Performer,
                ParticipantType.AgentManager,
                ParticipantType.CastingAssociate,
                ParticipantType.CastingDirector,
                ParticipantType.Producer,
                ParticipantType.Director,
              ],
            },
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id);
      expect(result).toBeNull();
    });

    it('should throw error when db error occurs', async () => {
      const id = 'some_id';
      const err = new Error('database problem!');
      when(mockModel.find(anything())).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findAllForUser(id);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });
});
