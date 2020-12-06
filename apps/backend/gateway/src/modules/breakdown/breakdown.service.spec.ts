import { Breakdown } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  anything,
  deepEqual,
  instance,
  mock,
  reset,
  verify,
  when
} from 'ts-mockito';
import { BreakdownModel } from '../../schema/breakdown.schema';
import { ProjectModel } from '../../schema/project.schema';
import { MockableDocumentQuery, MockableModel } from '../../test/mockables';
import { BreakdownService } from './breakdown.service';

describe('BreakdownService', () => {
  let classUnderTest: BreakdownService;

  const mockModel = mock(MockableModel);
  const mockProjectModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockQuery2 = mock(MockableDocumentQuery);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BreakdownService,
        {
          provide: getModelToken(BreakdownModel.name),
          useValue: instance(mockModel),
        },
        {
          provide: getModelToken(ProjectModel.name),
          useValue: instance(mockProjectModel),
        },
      ],
    }).compile();

    classUnderTest = module.get<BreakdownService>(BreakdownService);
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockQuery2);
  });

  describe('save', () => {
    it('should return valid Breakdown when properly updated without a project', async () => {
      const breakdown: Breakdown = {
        _id: 'bd'
      };

      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(breakdown);
        })
      );
      when(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: breakdown._id}),
          deepEqual(breakdown),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown);
      verify(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: breakdown._id}),
          deepEqual(breakdown),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).once();
      expect(result).toEqual(breakdown);
    });

    it('should return valid Breakdown when properly updated with a project', async () => {
      const breakdown: Breakdown = {
        _id: 'bd',
        project: {
          _id: 'someproject'
        }
      };

      when(mockQuery2.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(breakdown.project);
        })
      );
      when(
        mockProjectModel.findByIdAndUpdate(
          deepEqual({_id: breakdown.project._id}),
          deepEqual(breakdown.project),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery2));

      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(breakdown);
        })
      );
      when(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: breakdown._id}),
          deepEqual(breakdown),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown);
      verify(
        mockModel.findByIdAndUpdate(
          deepEqual({_id: breakdown._id}),
          deepEqual(breakdown),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).once();
      verify(
        mockProjectModel.findByIdAndUpdate(
          deepEqual({_id: breakdown.project._id}),
          deepEqual(breakdown.project),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).once();
      expect(result).toEqual(breakdown);
    });

    it('should return valid Breakdown when properly inserted (no project)', async () => {
      const breakdown: Breakdown = {
        _id: null,
      };

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(breakdown);
        })
      );
      when(
        mockModel.findByIdAndUpdate(
          anything(),
          deepEqual(breakdown),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown);
      verify(
        mockModel.findByIdAndUpdate(
          anything(),
          deepEqual(breakdown),
          deepEqual({ upsert: true, new: true, setDefaultsOnInsert: true })
        )
      ).once();
      expect(result).toEqual(breakdown);
    });

    it('should throw error when ids arent a match', async () => {
      const breakdown: Breakdown = {
        _id: 'someid',
      };

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', breakdown);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding audition', async () => {
      const breakdown: Breakdown = {
        _id: 'someid',
      };

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, breakdown);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new audition', async () => {
      const breakdown: Breakdown = {
        _id: null,
      };

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', breakdown);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });
  });
});
