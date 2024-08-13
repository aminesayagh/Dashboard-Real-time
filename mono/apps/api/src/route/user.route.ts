import { Error, Types } from 'mongoose';
import { NextFunction } from 'express';

import UserModel, { HydratedUser, UserMethods } from '../model/User.model';
import {
  ApiResponsePagination,
  ApiRequest,
  ApiResponse,
  ApiDeleteResponse,
} from '../types/Api';
import { UserMeAggregate, User } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { ERRORS } from '../constants/MESSAGE';
import { badRequestError } from '../helpers/error/BadRequestError';
import { paginationQuery, idQuery, PaginationBody } from '../middlewares/query';
import ManagerController from '../helpers/Controller';

type PublicUser = PublicDoc<Omit<HydratedUser, keyof UserMethods>>;

export default class UserController extends ManagerController {
  constructor() {
    super('/users');
    this.initRoutes();
  }
  private initRoutes() {
    this.router.get('/', paginationQuery, this.getAll);
    this.router.post('/', this.create);
    this.router.get('/:id', idQuery(), this.getOne);
    this.router.put('/:id', idQuery(), this.update);
    this.router.delete('/:id', idQuery(), this.delete);
    this.router.get('/me/:id', idQuery(), this.me);
    this.router.get('/email/:email', this.getByEmail);
  }
  private getAll = async (
    req: ApiRequest<PaginationBody>,
    res: ApiResponsePagination<User>,
    next: NextFunction,
  ): Promise<void> => {
    const { filter, limit, page } = req.body;
    UserModel.paginate(filter, { limit, page })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.BAD_REQUEST }));
          return;
        }
        res.status(200).json({ status: 'success', data: result });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private create = async (
    req: ApiRequest,
    res: ApiResponse<PublicUser>,
    next: NextFunction,
  ): Promise<void> => {
    const user = new UserModel(req.body);
    user
      .save()
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.BAD_REQUEST }));
          return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private getOne = async (
    req: ApiRequest<{ id: Types.ObjectId }>,
    res: ApiResponse<PublicUser>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    UserModel.findById(id)
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private update = async (
    req: ApiRequest<
      Partial<User> & {
        id: Types.ObjectId;
      }
    >,
    res: ApiResponse<PublicUser>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    UserModel.findByIdAndUpdate(id, req.body, { new: true })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private delete = async (
    req: ApiRequest<{ id: Types.ObjectId }>,
    res: ApiDeleteResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    UserModel.deleteOne({ _id: id })
      .then((result) => {
        if (!result || result.deletedCount === 0) {
          res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
          return;
        }
        res.status(200).json({
          status: 'success',
          data: { deletedCount: result.deletedCount },
        });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private me = async (
    req: ApiRequest<{
      id: Types.ObjectId;
    }>,
    res: ApiResponse<UserMeAggregate>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    UserModel.me(id)
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        res.status(200).json({ status: 'success', data: result });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private getByEmail = async (
    req: ApiRequest,
    res: ApiResponse<PublicUser>,
    next: NextFunction,
  ): Promise<void> => {
    const { email } = req.params;
    UserModel.findOne({ email })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
}
