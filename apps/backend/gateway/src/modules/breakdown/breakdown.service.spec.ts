import { Breakdown, ModelFactory } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  deepEqual,
  instance,
  mock,
  reset,
  strictEqual,
  verify,
  when
} from 'ts-mockito';
import { BreakdownDocument } from '../../schema/breakdown.schema';
import { MockableDocument, MockableDocumentQuery, MockableModel } from '../../test/mockables';
import { ProjectService } from '../project/project.service';
import { BreakdownService } from './breakdown.service';

describe('BreakdownService', () => {
  let classUnderTest: BreakdownService;

  const mockBreakdownModel = mock(MockableModel);
  const mockBreakdownDocument = mock(MockableDocument);
  const mockQuery = mock(MockableDocumentQuery);
  const mockProjectService = mock(ProjectService);

  beforeEach(async () => {
    classUnderTest = new BreakdownService(
      instance(mockProjectService),
      instance(mockBreakdownModel) as Model<BreakdownDocument>)
  });

  afterEach(async () => {
    reset(mockBreakdownModel);
    reset(mockBreakdownDocument);
    reset(mockQuery);
    reset(mockProjectService);
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
      const result = await classUnderTest.save(breakdown._id, breakdown, 'userid');
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

      when(mockProjectService.save(strictEqual(breakdown.project._id), deepEqual(breakdown.project), strictEqual('userid')))
        .thenResolve(breakdown.project);

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(breakdown._id, breakdown, 'userid');
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
      const result = await classUnderTest.save(breakdown._id, breakdown, 'userid');
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
        await classUnderTest.save('differentid', breakdown, 'userid');
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
        await classUnderTest.save(null, breakdown, 'userid');
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
        await classUnderTest.save('some_id', breakdown, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });
  });
});
