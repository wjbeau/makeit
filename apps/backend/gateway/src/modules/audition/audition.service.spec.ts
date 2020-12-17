import {
  Audition,
  ModelFactory,
  PermissionRole,
} from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
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
import { AuditionDocument } from '../../schema/Audition.schema';
import {
  MockableDocument,
  MockableDocumentQuery,
  MockableModel,
} from '../../test/mockables';
import { BreakdownService } from '../breakdown/breakdown.service';
import { AuditionService } from './Audition.service';
import { permissionsSpec } from '../../schema/permission.schema';

describe('AuditionService', () => {
  let classUnderTest: AuditionService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(MockableDocument);
  const mockBreakdownService = mock(BreakdownService);

  beforeEach(async () => {
    classUnderTest = new AuditionService(
      instance(mockBreakdownService),
      instance(mockModel) as Model<AuditionDocument>
    );
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
    reset(mockBreakdownService);
  });

  describe('save', () => {
    it('should return valid Audition when properly updated, no breakdown', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition.breakdown = null;
      audition._id = 'auditionid';

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(audition);

      when(mockModel.findOne(deepEqual({ _id: audition._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        audition._id,
        audition,
        'userid'
      );
      verify(mockDocument.set(anything())).once();
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: audition._id }))).once();
      verify(
        mockDocument.populate(
          deepEqual({
            path: 'breakdown',
            populate: { path: 'project' },
          })
        )
      ).once();
      expect(result).toEqual(audition);
    });

    it('should return valid Audition when properly updated with a breakdown', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition.breakdown._id = 'breakdownid';
      audition._id = 'auditionid';

      when(
        mockBreakdownService.save(
          strictEqual('breakdownid'),
          deepEqual(audition.breakdown),
          strictEqual('userid')
        )
      ).thenResolve(audition.breakdown);

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(audition);

      when(mockModel.findOne(deepEqual({ _id: audition._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        audition._id,
        audition,
        'userid'
      );
      verify(mockDocument.set(anything())).once();
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: audition._id }))).once();
      verify(
        mockDocument.populate(
          deepEqual({
            path: 'breakdown',
            populate: { path: 'project' },
          })
        )
      ).once();
      expect(result).toEqual(audition);
    });

    it('should return valid Audition when properly inserted', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition.breakdown = null;
      audition._id = null;

      when(mockDocument.toObject()).thenReturn(audition);

      when(mockModel.findOne(deepEqual({ _id: audition._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      when(mockModel.create(deepEqual(audition))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        audition._id,
        audition,
        'userid'
      );
      verify(mockDocument.set(anything())).never();
      verify(mockModel.create(deepEqual(audition))).once();
      verify(mockModel.findOne(deepEqual({ _id: audition._id }))).once();
      verify(
        mockDocument.populate(
          deepEqual({
            path: 'breakdown',
            populate: { path: 'project' },
          })
        )
      ).once();
      expect(result).toEqual(audition);
    });

    it('should throw error when ids arent a match', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition._id = 'auditionid';
      audition.breakdown = null;

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', audition, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding audition', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition._id = 'auditionid';
      audition.breakdown = null;

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, audition, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new audition', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition.breakdown = null;

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', audition, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition._id = 'auditionid';
      audition.breakdown = null;

      when(mockDocument.toObject()).thenReturn(audition);

      when(mockModel.findOne(deepEqual({ _id: audition._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      const err = new Error('mock error');
      when(mockModel.create(deepEqual(audition))).thenThrow(err);
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(audition._id, audition, 'userid');
        fail();
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });

  describe('findById', () => {
    it('should return valid Audition when found', async () => {
      const audition: Audition = ModelFactory.createEmptyAudition();
      audition._id = 'auditionid';
      audition.breakdown = null;

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
      const audition1: Audition = ModelFactory.createEmptyAudition();
      audition1._id = 'auditionid1';
      audition1.breakdown = null;
      const audition2: Audition = ModelFactory.createEmptyAudition();
      audition2._id = 'auditionid2';
      audition2.breakdown = null;
      const auditions: Audition[] = [audition1, audition2];

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(
        mockQuery.sort(deepEqual({ deadline: -1, auditionTime: -1 }))
      ).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(auditions);
        })
      );
      when(
        mockModel.find(
          deepEqual(
            permissionsSpec(id, null, [
              PermissionRole.Admin,
              PermissionRole.Editor,
              PermissionRole.Viewer,
            ])
          )
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
      when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(
        mockModel.find(
          deepEqual(
            permissionsSpec(id, null, [
              PermissionRole.Admin,
              PermissionRole.Editor,
              PermissionRole.Viewer,
            ])
          )
        )
      ).thenReturn(instance(mockQuery));
      when(
        mockQuery.sort(deepEqual({ deadline: -1, auditionTime: -1 }))
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
