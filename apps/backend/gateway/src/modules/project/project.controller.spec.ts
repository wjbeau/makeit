import { Project } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { instance, mock, reset, strictEqual, when } from 'ts-mockito';
import { ProjectModel } from '../../schema/project.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

describe('ProjectController', () => {
  let controllerUnderTest: ProjectController;

  const mockedService = mock(ProjectService);
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

    controllerUnderTest = new ProjectController(mockedServiceInstance)
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('getProjects', () => {
    it('should return projects', async () => {
      const aud = new ProjectModel();
      const aud2 = new ProjectModel();

      const req = { user: user }

      when(mockedService.findAllForUser(strictEqual(user._id))).thenReturn(
        new Promise<Project[]>((resolve) => { resolve([aud, aud2]) }),
      );
      expect(controllerUnderTest).toBeDefined();
      const result = await controllerUnderTest.getProjects(req)
      expect(result).toBeDefined();
      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(aud);
      expect(result[1]).toEqual(aud2);
    });
  });

  describe('getProject', () => {
    it('should return project', async () => {
      const aud = new ProjectModel();

      const params = { id: 'someid' }

      when(mockedService.findById(strictEqual(params.id))).thenReturn(
        new Promise<Project>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.getProject(params)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
  });

  describe('updateProject', () => {
    it('should update when all is valid', async () => {
      const params = { id: 'someid' }
      const aud = new ProjectModel();
      aud['_id'] = params.id;
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(aud), strictEqual(user._id))).thenReturn(
        new Promise<Project>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.updateProject(params, aud, req)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const aud = new ProjectModel();
      aud['_id'] = params.id;
      const error = new BadRequestException('Nonono');
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(aud), strictEqual(user._id))).thenThrow(error);

      try {
        await controllerUnderTest.updateProject(params, aud, req)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });

    describe('createProject', () => {
      it('should save when all is valid', async () => {
        const aud = new ProjectModel();
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(aud), strictEqual(user._id))).thenReturn(
          new Promise<Project>((resolve) => { resolve(aud) }),
        );
        const result = await controllerUnderTest.createProject(aud, req)
        expect(result).toBeDefined();
        expect(result).toEqual(aud);
      });
      it('should fail when an error is thrown', async () => {
        const aud = new ProjectModel();
        const error = new BadRequestException('Nonono');
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(aud), strictEqual(user._id))).thenThrow(error);
  
        try {
          await controllerUnderTest.createProject(aud, req)
          fail();
        } catch (e) {
          expect(e).toEqual(error); 
        }
      });
    });
  });
});
