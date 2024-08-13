import mongoose, { Types } from 'mongoose';
import { NextFunction } from 'express';

import { ERRORS } from '../constants/MESSAGE';
import { ApiRequest, ApiResponse, ApiDeleteResponse } from '../types/Api';
import {
  cloudinaryImageDeleteMethod,
  cloudinaryImageUploadMethod,
  upload,
} from '../utils/Cloudinary';
import { badRequestError } from '../helpers/error/BadRequestError';
import { STATE_ATTACHMENT, zModelName } from '@rtd/shared-ts';

import ResourceModel, {
  HydratedAttachment,
  HydratedResource,
  ResourceMethods,
} from '../model/Resource.model';
import { Attachment } from '../types/Models';

type PublicResource = PublicDoc<Omit<HydratedResource, keyof ResourceMethods>>;
type PublicAttachment = PublicDoc<HydratedAttachment>;

import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { idQuery } from '../middlewares/query';
import ManagerController from '../helpers/Controller';

function objectFileToArray(
  files:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File,
): Express.Multer.File[] {
  return Array.isArray(files) ? files : Array.from(Object.values(files)).flat();
}

export default class ResourceController extends ManagerController {
  constructor() {
    super('/resources');
    this.initRoutes();
  }
  private initRoutes() {
    this.router.post('/upload/imgs', upload.array('img'), this.uploadImages);
    this.router.get('/:id', idQuery(), this.getOne);
    this.router.put('/:id', idQuery(), this.update);
    this.router.get('/:id/attachments', idQuery(), this.getAttachments);
    this.router.post(
      '/:id/attachments/:attachment_reference',
      idQuery('id', 'attachment_reference'),
      this.attach,
    );
    this.router.delete(
      '/:id/attachments/:attachment_id',
      idQuery('id', 'attachment_id'),
      this.detach,
    );
    this.router.delete('/:id', idQuery('id'), this.delete);
  }
  private uploadImages = async (
    req: ApiRequest,
    res: ApiResponse<PublicResource>,
    next: NextFunction,
  ): Promise<void> => {
    const files = req.files;
    if (!files) {
      next(badRequestError({ message: ERRORS.MEDIA_NOT_FOUND }));
      return;
    }
    Promise.all(
      objectFileToArray(files).map(async (file) => {
        const newPath = await cloudinaryImageUploadMethod(file).catch((err) => {
          throw new Error(err);
        });
        return {
          media_source: newPath.secure_url,
          media_public_id: newPath.public_id,
          media_signature: newPath.signature,
          media_url: newPath.url,
        };
      }),
    ).then((media) => {
      const resource = new ResourceModel(req.body);
      Promise.all(
        media.map((m) => {
          resource.assignMedia(m);
        }),
      )
        .then(() => {
          resource
            .save()
            .then((result) => {
              res.status(200).json({
                status: 'success',
                data: toPublicDoc(result as HydratedResource),
              });
            })
            .catch((err) => {
              next(
                badRequestError({ message: err.message || ERRORS.BAD_REQUEST }),
              );
            });
        })
        .catch((err) => {
          next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    });
  };
  private getOne = async (
    req: ApiRequest<{ id: Types.ObjectId }>,
    res: ApiResponse<PublicResource>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findById(id)
      .then((resource) => {
        if (!resource) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        resource.findAttachmentById('123');
        res.status(200).json({
          status: 'success',
          data: toPublicDoc(resource as HydratedResource),
        });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private update = async (
    req: ApiRequest,
    res: ApiResponse<PublicResource>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findById(id)
      .then((resource) => {
        if (!resource) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        resource.set(req.body);
        resource
          .save()
          .then((result) => {
            res.status(200).json({
              status: 'success',
              data: toPublicDoc(result as HydratedResource),
            });
          })
          .catch((err) => {
            next(
              badRequestError({ message: err.message || ERRORS.BAD_REQUEST }),
            );
          });
      })
      .catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private getAttachments = async (
    req: ApiRequest<{ id: Types.ObjectId }>,
    res: ApiResponse<Attachment[]>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findById(id)
      .then((resource) => {
        if (!resource) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        res.status(200).json({
          status: 'success',
          data: resource.resource_attachments,
        });
      })
      .catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private attach = async (
    req: ApiRequest<
      {
        attachment_reference: Types.ObjectId;
        attachment_collection: string;
      } & { id: Types.ObjectId }
    >,
    res: ApiResponse<PublicAttachment>,
    next: NextFunction,
  ): Promise<void> => {
    const {
      id: IdResource,
      attachment_reference,
      attachment_collection,
    } = req.body;
    ResourceModel.findById(IdResource)
      .then((resource) => {
        if (!resource) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        const attachment_collection_valid = zModelName.parse(
          attachment_collection,
        );
        const modelCollection = mongoose.connection.db.collection(
          attachment_collection,
        );
        modelCollection
          .findOne({
            _id: attachment_reference,
          })
          .then((found) => {
            if (!found) {
              next(badRequestError({ message: ERRORS.NOT_FOUND }));
              return;
            }
            // create new attachment
            resource.assignAttachment({
              attachment_reference,
              attachment_collection: attachment_collection_valid,
              attachment_state: STATE_ATTACHMENT.ATTACHED,
            });
            const attachmentResponse = resource.resource_attachments.find(
              (attachment) =>
                attachment.attachment_reference.toString() ===
                attachment_reference.toString(),
            );
            if (!attachmentResponse) {
              next(badRequestError({ message: ERRORS.INTERNAL_SERVER_ERROR }));
              return;
            }
            res.status(200).json({
              status: 'success',
              data: toPublicDoc(attachmentResponse),
            });
          })
          .catch((err) => {
            next(
              badRequestError({ message: err.message || ERRORS.BAD_REQUEST }),
            );
          });
      })
      .catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private detach = async (
    req: ApiRequest<{ id: Types.ObjectId; attachment_id: Types.ObjectId }>,
    res: ApiResponse<PublicAttachment>,
    next: NextFunction,
  ): Promise<void> => {
    const { id, attachment_id } = req.body;
    ResourceModel.findById(id)
      .then((resource) => {
        if (!resource) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        const attachment = resource.resource_attachments.find(
          (attachment) =>
            attachment._id.toString() === attachment_id.toString(),
        );
        if (!attachment) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        resource.resource_attachments = resource.resource_attachments.filter(
          (attachment) =>
            attachment._id.toString() !== attachment_id.toString(),
        );
        resource
          .save()
          .then(() => {
            res.status(200).json({
              status: 'success',
              data: toPublicDoc(attachment),
            });
            return;
          })
          .catch((err) => {
            next(
              badRequestError({ message: err.message || ERRORS.BAD_REQUEST }),
            );
          });
      })
      .catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
  private delete = async (
    req: ApiRequest<{ id: Types.ObjectId }>,
    res: ApiDeleteResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findByIdAndDelete(id)
      .then((result) => {
        if (!result) {
          next(badRequestError({ message: ERRORS.NOT_FOUND }));
          return;
        }
        Promise.all(
          result.resource_media.map(async (media) => {
            await cloudinaryImageDeleteMethod(media.media_public_id).catch(
              (err) => {
                throw new Error(err);
              },
            );
          }),
        );
        res.status(200).json({
          status: 'success',
          data: {
            deletedCount: 1,
          },
        });
      })
      .catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
      });
  };
}
