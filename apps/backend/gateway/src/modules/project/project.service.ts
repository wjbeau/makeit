import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectStatus } from '../../../../../../libs/types/src/project.model';
import { ParticipantReferenceType, ParticipantType } from '../../../../../../libs/types/src/participant.model';
import {
  ProjectModel,
  ProjectModelDocument
} from '../../schema/project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel.name)
    private projectModel: Model<ProjectModelDocument>
  ) {}

  async save(id: string, project: Project): Promise<Project | undefined> {
    //the path variable must match the data posted
    if ((id || project._id) && id !== project._id) {
      throw new BadRequestException();
    }


    // Find the document and update it if required or save a new one if not.
    const result = await this.projectModel
      .findOne({ _id: project._id })
      .then((dbRes) => {
        if (dbRes) {
          dbRes.set(project);
          return dbRes.save();
        } else {
          return this.projectModel.create(project);
        }
      })
      .catch((error) => {
        throw new BadRequestException(error, 'Database update failed.');
      });

    return result.toObject();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Project | undefined> {
    return await this.projectModel.findOne({ _id: id }).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any): Promise<Project[] | undefined> {
    //find all Projects where the given user is a relevant participant
    const result: Project[] = await this.projectModel
      .find({
        $or: [
          {'status': ProjectStatus.Active},
          {'status': ProjectStatus.Completed},
          {'status': ProjectStatus.Cancelled},
        ]
      //   'participants.info.type': ParticipantReferenceType.UserAccount,
      //   'participants.info.ref': id,
      //   'participants.role': {
      //     $in: [
      //       ParticipantType.Auditioning,
      //       ParticipantType.Cast,
      //       ParticipantType.AgentManager,
      //       ParticipantType.CastingAssociate,
      //       ParticipantType.CastingDirector,
      //       ParticipantType.Producer,
      //       ParticipantType.Director,
      //     ],
      //   }, TODO replace this with a permissions model
       }) 
      .lean()
      .exec();
    return result;
  }
}
