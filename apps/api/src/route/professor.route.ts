import { Types } from 'mongoose';
import { NextFunction } from 'express';
import { ERRORS } from '../constants/MESSAGE';
import ProfessorModel, { HydratedProfessor } from '../model/Professor.model';
import { ApiRequest, ApiResponse } from '../types/Api';
import { Professor } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { idQuery } from '../middlewares/query';
import ManagerController from '../helpers/Controller';

type PublicProfessor = PublicDoc<HydratedProfessor>;

export default class ProfessorController extends ManagerController {
  constructor() {
    super('/professors');
    this.initRoutes();
  }
  private initRoutes() {
    this.router.post('/', this.create);
    this.router.put('/:id', idQuery(), this.update);
  }
  private create = async (
    req: ApiRequest,
    res: ApiResponse<PublicProfessor>,
    next: NextFunction,
  ): Promise<void> => {
    const professor = new ProfessorModel(req.body);
    professor
      .save()
      .then((result) => {
        if (!result) {
          next({ message: ERRORS.BAD_REQUEST });
          return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
      })
      .catch((err: Error) => {
        next({ message: err.message || ERRORS.BAD_REQUEST });
      });
  };
  private update = async (
    req: ApiRequest<Partial<Professor> & { id: Types.ObjectId }>,
    res: ApiResponse<PublicProfessor>,
    next: NextFunction,
  ) => {
    const { id, ...bodyProfessor } = req.body;
    ProfessorModel.findByIdAndUpdate(id, bodyProfessor, { new: true })
      .then((result) => {
        if (!result) {
          next({ message: ERRORS.NOT_FOUND });
          return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
      })
      .catch((err: Error) => {
        next({ message: err.message || ERRORS.BAD_REQUEST });
      });
  };
}
