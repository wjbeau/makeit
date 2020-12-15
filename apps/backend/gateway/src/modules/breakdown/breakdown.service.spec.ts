import { Breakdown, ModelFactory } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  deepEqual,
  instance,
  mock,
  reset,
  verify,
  when
} from 'ts-mockito';
import { BreakdownDocument } from '../../schema/breakdown.schema';
import { ProjectModelDocument } from '../../schema/project.schema';
import { MockableDocument, MockableDocumentQuery, MockableModel } from '../../test/mockables';
import { BreakdownService } from './breakdown.service';

describe('BreakdownService', () => {
  let classUnderTest: BreakdownService;

  const mockBreakdownModel = mock(MockableModel);
  const mockProjectModel = mock(MockableModel);
  const mockBreakdownDocument = mock(MockableDocument);
  const mockProjectDocument = mock(MockableDocument);
  const mockQuery = mock(MockableDocumentQuery);
  const mockQuery2 = mock(MockableDocumentQuery);

  beforeEach(async () => {
    classUnderTest = new BreakdownService(
      instance(mockBreakdownModel) as Model<BreakdownDocument>,
      instance(mockProjectModel) as Model<ProjectModelDocument>);
  });

  afterEach(async () => {
    reset(mockBreakdownModel);
    reset(mockProjectModel);
    reset(mockBreakdownDocument);
    reset(mockProjectDocument);
    reset(mockQuery);
    reset(mockQuery2);
  });

  describe('save', () => {
    it('should return valid Breakdown when properly updated without a project', async () => {
      const breakdown: Breakdown = ModelFactory.createEmptyBreakdown();
      breakdown._id = 'bd';
      breakdown.project = null;

      when(mockBreakdownDocument.save()).thenReturn(instance(mockBreakdownDocument));
      when(mockBreakdownDocument.toObject()).thenReturn(breakdown);

      when(
        mockBreakdownModel.findOne(deepEqual({_id: breakdown._id}))
      ).thenReturn(new Promise(resolve => resolve(instance(mockBreakdownDocument))));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown);
      verify(
        mockBreakdownModel.findOne(deepEqual({_id: breakdown._id}))
      ).once();
      expect(result).toEqual(breakdown);
    });

    it('should return valid Breakdown when properly updated with a project', async () => {
      const breakdown: Breakdown = ModelFactory.createEmptyBreakdown();
      breakdown._id = 'bd';
      breakdown.project._id = 'someproject'

      when(mockBreakdownDocument.save()).thenReturn(instance(mockBreakdownDocument));
      when(mockBreakdownDocument.toObject()).thenReturn(breakdown);
      when(
        mockBreakdownModel.findOne(deepEqual({_id: breakdown._id}))
      ).thenReturn(new Promise(resolve => resolve(instance(mockBreakdownDocument))));

      when(mockProjectDocument.save()).thenReturn(instance(mockProjectDocument));
      when(mockProjectDocument.toObject()).thenReturn(breakdown.project);
      when(
        mockProjectModel.findOne(deepEqual({_id: breakdown.project._id}))
      ).thenReturn(new Promise(resolve => resolve(instance(mockProjectDocument))));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown);
      verify(
        mockBreakdownModel.findOne(deepEqual({_id: breakdown._id}))
      ).once();
      expect(result).toEqual(breakdown);
    });

    it('should return valid Breakdown when properly inserted (no project)', async () => {
      const breakdown: Breakdown = ModelFactory.createEmptyBreakdown();
      breakdown._id = null;
      breakdown.project = null;

      when(mockBreakdownModel.create(deepEqual(breakdown))).thenReturn(instance(mockBreakdownDocument));
      when(mockBreakdownDocument.toObject()).thenReturn(breakdown);
      when(
        mockBreakdownModel.findOne(deepEqual({_id: breakdown._id}))
      ).thenReturn(new Promise(resolve => resolve(null)));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown);
      verify(
        mockBreakdownModel.findOne(deepEqual({_id: breakdown._id}))
      ).once();
      verify(mockBreakdownModel.create(deepEqual(breakdown))).once();
      verify(mockBreakdownDocument.save()).never();
      expect(result).toEqual(breakdown);
    });

    it('should throw error when ids arent a match', async () => {
      const breakdown: Breakdown = ModelFactory.createEmptyBreakdown();
      breakdown._id = 'someid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', breakdown);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding audition', async () => {
      const breakdown: Breakdown = ModelFactory.createEmptyBreakdown();
      breakdown._id = 'someid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, breakdown);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new audition', async () => {
      const breakdown: Breakdown = ModelFactory.createEmptyBreakdown();
      breakdown._id = null;

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
