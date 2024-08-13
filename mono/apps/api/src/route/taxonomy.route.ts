import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { ERRORS } from '../constants/MESSAGE';
import TaxonomyModel, { HydratedTaxonomy } from '../model/Taxonomy.model';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import {
  ApiResponse,
  ApiRequest,
  ApiResponsePagination,
  ApiDeleteResponse,
} from '../types/Api';
import PostulationTypeModel, {
  HydratedPostulationType,
} from '../model/PostulationType.model';
import PostulationTypeContentModel, {
  HydratedPostulationTypeContent,
} from '../model/PostulationTypeContent.model';
import {
  PostulationType,
  PostulationTypeContent,
  Taxonomy,
} from '../types/Models';
import { idQuery, PaginationBody, paginationQuery } from '../middlewares/query';
import { badRequestError } from '../helpers/error/BadRequestError';
import ManagerController from '../helpers/Controller';

type PublicTaxonomy = PublicDoc<HydratedTaxonomy>;
type PublicPostulationType = PublicDoc<HydratedPostulationType>;
type PublicPostulationTypeContent = PublicDoc<HydratedPostulationTypeContent>;

export default class TaxonomyRouteController extends ManagerController {
  constructor() {
    super('/taxonomies');
    this.initRoutes();
  }
  private initRoutes() {
    this.router.get('/', paginationQuery, this.getAll);
    this.router.post('/', this.create);
    this.router.get('/:id', idQuery(), this.getOne);
    this.router.put('/:id', idQuery(), this.update);
    this.router.delete('/:id', idQuery(), this.delete);
    this.router.get(
      '/:id/postulation_types',
      paginationQuery,
      this.getPostulationTypes,
    );
    this.router.post(
      '/:id/postulation_types',
      idQuery(),
      this.createPostulationType,
    );
    this.router.get(
      '/:id/postulation_types/:postulation_type_id',
      idQuery('id', 'postulation_type_id'),
      this.getPostulationType,
    );
    this.router.put(
      '/:id/postulation_types/:postulation_type_id',
      idQuery('id', 'postulation_type_id'),
      this.updatePostulationType,
    );
    this.router.delete(
      '/:id/postulation_types/:postulation_type_id',
      idQuery('id', 'postulation_type_id'),
      this.deletePostulationType,
    );
    this.router.post(
      '/:id/postulation_types/:postulation_type_id/postulation_type_content',
      idQuery('id', 'postulation_type_id'),
      this.createPostulationTypeContent,
    );
    this.router.get(
      '/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id',
      idQuery('id', 'postulation_type_id', 'content_id'),
      this.getPostulationTypeContent,
    );
    this.router.put(
      '/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id',
      idQuery('id', 'postulation_type_id', 'content_id'),
      this.updatePostulationTypeContent,
    );
    this.router.delete(
      '/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id',
      idQuery('id', 'postulation_type_id', 'content_id'),
      this.deletePostulationTypeContent,
    );
    this.router.get('/types/:type', paginationQuery, this.getByType);
    this.router.put('/types/:type', this.updateByType);
    this.router.delete('/types/:type', this.deleteByType);
  }
  private getAll = async (
    req: ApiRequest<PaginationBody>,
    res: ApiResponsePagination<Taxonomy>,
    next: NextFunction,
  ): Promise<void> => {
    const { filter, limit, page } = req.body;
    TaxonomyModel.paginate(filter, { limit, page })
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
    res: ApiResponse<PublicTaxonomy>,
    next: NextFunction,
  ): Promise<void> => {
    const taxonomy = new TaxonomyModel(req.body);
    taxonomy
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
    res: ApiResponse<PublicTaxonomy>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    TaxonomyModel.findById(id)
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
      Partial<Taxonomy> & {
        id: Types.ObjectId;
      }
    >,
    res: ApiResponse<PublicTaxonomy>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    TaxonomyModel.findByIdAndUpdate(id, req.body, { new: true })
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
  ) => {
    const { id } = req.body;
    TaxonomyModel.deleteOne({ _id: id })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
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
  private getPostulationTypes = async (
    req: ApiRequest<PaginationBody>,
    res: ApiResponsePagination<PostulationType>,
    next: NextFunction,
  ): Promise<void> => {
    const { filter, limit, page } = req.body;
    PostulationTypeModel.paginate(filter, { limit, page })
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
  private createPostulationType = async (
    req: ApiRequest<{ id: Types.ObjectId }>,
    res: ApiResponse<PublicPostulationType>,
    next: NextFunction,
  ): Promise<void> => {
    const { id, ...bodyPostulationType } = req.body;
    TaxonomyModel.findById(id)
      .then(async (taxonomy) => {
        if (!taxonomy) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        const postulationType = new PostulationTypeModel({
          ...bodyPostulationType,
          taxonomies_id: [taxonomy._id],
        });
        postulationType
          .save()
          .then((result) => {
            if (!result) {
              next(badRequestError({ message: ERRORS.BAD_REQUEST }));
              return;
            }
            res
              .status(200)
              .json({ status: 'success', data: toPublicDoc(result) });
          })
          .catch((err: Error) => {
            next(
              badRequestError({ message: err.message || ERRORS.BAD_REQUEST }),
            );
          });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private getPostulationType = async (
    req: ApiRequest<{
      id: Types.ObjectId;
      postulation_type_id: Types.ObjectId;
    }>,
    res: ApiResponse<PublicPostulationType>,
    next: NextFunction,
  ): Promise<void> => {
    const { id, postulation_type_id } = req.body;
    PostulationTypeModel.findOne({
      taxonomies_id: { $in: [id] },
      _id: postulation_type_id,
    })
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
  private updatePostulationType = async (
    req: ApiRequest<
      Partial<PublicPostulationType> & {
        id: Types.ObjectId;
        postulation_type_id: Types.ObjectId;
      }
    >,
    res: ApiResponse<PublicPostulationType>,
    next: NextFunction,
  ) => {
    const { id, postulation_type_id } = req.body;
    PostulationTypeModel.findOneAndUpdate(
      { taxonomies_id: { $in: [id] }, _id: postulation_type_id },
      req.body,
      { new: true },
    )
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
  private deletePostulationType = async (
    req: ApiRequest<{
      id: Types.ObjectId;
      postulation_type_id: Types.ObjectId;
    }>,
    res: ApiDeleteResponse,
    next: NextFunction,
  ) => {
    const { id, postulation_type_id } = req.body;
    PostulationTypeModel.deleteOne({
      taxonomies_id: { $in: [id] },
      _id: postulation_type_id,
    })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
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
  private createPostulationTypeContent = async (
    req: ApiRequest<
      Partial<PublicPostulationTypeContent> & {
        id: Types.ObjectId;
        postulation_type_id: Types.ObjectId;
      }
    >,
    res: ApiResponse<PublicPostulationTypeContent>,
    next: NextFunction,
  ) => {
    const { postulation_type_id, id } = req.body;
    PostulationTypeModel.findOne({
      taxonomies_id: { $in: [id] },
      _id: postulation_type_id,
    }).then((result) => {
      if (!result) {
        next(badRequestError({ message: ERRORS.NOT_FOUND }));
        return;
      }
      const postulation_type_content = new PostulationTypeContentModel(
        req.body,
      );
      result.postulation_type_content.push(postulation_type_content._id);
      result
        .save()
        .then(() => {
          postulation_type_content
            .save()
            .then((result) => {
              if (!result) {
                next(badRequestError({ message: ERRORS.BAD_REQUEST }));
                return;
              }
              res
                .status(200)
                .json({ status: 'success', data: toPublicDoc(result) });
            })
            .catch((err: Error) => {
              next(
                badRequestError({ message: err.message || ERRORS.BAD_REQUEST }),
              );
            });
        })
        .catch((err: Error) => {
          next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    });
  };
  private getPostulationTypeContent = async (
    req: ApiRequest<{
      id: Types.ObjectId;
      postulation_type_id: Types.ObjectId;
      content_id: Types.ObjectId;
    }>,
    res: ApiResponse<PublicPostulationTypeContent>,
    next: NextFunction,
  ) => {
    const { content_id } = req.params;
    PostulationTypeContentModel.findOne({ _id: content_id })
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
  private updatePostulationTypeContent = async (
    req: ApiRequest<
      Partial<PostulationTypeContent> & {
        id: Types.ObjectId;
        postulation_type_id: Types.ObjectId;
        content_id: Types.ObjectId;
      },
      unknown
    >,
    res: ApiResponse<PublicPostulationTypeContent>,
    next: NextFunction,
  ) => {
    const { content_id } = req.body;
    PostulationTypeContentModel.findByIdAndUpdate(content_id, req.body, {
      new: true,
    })
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
  private deletePostulationTypeContent = async (
    req: ApiRequest<{
      id: Types.ObjectId;
      postulation_type_id: Types.ObjectId;
      content_id: Types.ObjectId;
    }>,
    res: ApiDeleteResponse,
    next: NextFunction,
  ) => {
    const { content_id } = req.body;
    PostulationTypeContentModel.deleteOne({ _id: content_id })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
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
  private getByType = async (
    req: ApiRequest<
      PaginationBody,
      unknown,
      {
        type: string;
      }
    >,
    res: ApiResponsePagination<Taxonomy>,
    next: NextFunction,
  ): Promise<void> => {
    const { filter, limit, page } = req.body;
    const { type } = req.params;
    TaxonomyModel.paginate({ ...filter, taxonomy_type: type }, { limit, page })
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
  private updateByType = async (
    req: ApiRequest<Partial<Taxonomy>, unknown, { type: string }>,
    res: ApiResponse<{
      count: number;
    }>,
    next: NextFunction,
  ) => {
    const { type } = req.params;
    TaxonomyModel.updateMany({ taxonomy_type: type }, req.body, { new: true })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        res.status(200).json({
          status: 'success',
          data: { count: result.modifiedCount },
        });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private deleteByType = async (
    req: ApiRequest,
    res: ApiDeleteResponse,
    next: NextFunction,
  ) => {
    const { type } = req.params;
    TaxonomyModel.deleteMany({ taxonomy_type: type })
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
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
}
