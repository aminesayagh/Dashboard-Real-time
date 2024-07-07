import express, { NextFunction } from 'express';
import { ERRORS } from '../constants/MESSAGE';
import { ApiRequest, ApiResponse, ApiDeleteResponse } from '../types/Api';
import { cloudinaryImageDeleteMethod, cloudinaryImageUploadMethod, upload } from '../utils/Cloudinary'; 
import { badRequestError } from '../helpers/error/BadRequestError';
import {  STATE_ATTACHMENT, zModelName } from '@org/shared-ts';
import mongoose, { Types } from 'mongoose';

import ResourceModel, { HydratedAttachment, HydratedResource } from '../model/Resource.model';
import { Attachment } from '../types/Models';
const router = express.Router();

type PublicResource = PublicDoc<HydratedResource>;
type PublicAttachment = PublicDoc<HydratedAttachment>;

import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { idQuery } from '../middlewares/query';


// const createMedia = async (file: Express.Multer.File, resource_type: ResourceTypes, resource_folder: string) => {
//     const parser = new DataUriParser();
//     const base64Image = parser.format(path.extname(`${file.originalname}_${generateRandomNumber()}`).toString(), file.buffer);
//     if (!base64Image || !base64Image.content) {
//         throw new Error(ERRORS.FAILED_TO_GENERATE_BASE64);
//     }
//     try {
//         return await cloud.uploader.upload(base64Image.content, {
//             resource_type,
//             folder: resource_folder,
//         });
//     } catch (err) {
//         throw new Error(ERRORS.FAILED_UPDATING_MEDIA);
//     }
// }
// const deleteMedia = async (public_id: string) => {
//     try {
//         return await cloud.uploader.destroy(public_id);
//     } catch (err) {
//         throw new Error(ERRORS.FAILED_TO_DELETE_MEDIA);
//     }
// }

function objectFileToArray(files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File): Express.Multer.File[] {
    return Array.isArray(files) ? files : Array.from(Object.values(files)).flat();
}

router.post('/upload/imgs', upload.array('img'), async (req, res: ApiResponse<PublicResource>, next: NextFunction): Promise<void> => {
    
    const files = req.files;
    if (!files) {
        next(badRequestError({ message: ERRORS.MEDIA_NOT_FOUND }));
        return;
    }
    
    Promise.all(objectFileToArray(files).map(async (file) => {
        const newPath = await cloudinaryImageUploadMethod(file).catch((err) => {
            throw new Error(err);
        });
        return {
            media_source: newPath.secure_url,
            media_public_id: newPath.public_id,
            media_signature: newPath.signature,
            media_url: newPath.url
        };
    })).then((media) => {
        const resource = new ResourceModel(req.body);
        Promise.all(media.map((m) => {
            resource.assignMedia(m);
        })).then(() => {
            resource.save().then((result) => {
                res.status(200).json({
                    status: 'success',
                    data: toPublicDoc(result)
                });
            }).catch((err) => {
                next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
            });
        }).catch((err) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    })

})

// router.post('/upload/imgs', multer().a(), async (req: ApiRequest<Partial<Resource> & { file: Express.Multer.File[] }>, res: ApiResponse<PublicResource>, next: NextFunction): Promise<void> => {
//     const files = req.files;
//     if (!files) {
//         res.status(400).json({
//             message: ERRORS.MEDIA_NOT_FOUND,
//             status: 'error'
//         });
//     }
//     const body = zBodyMedia.parse(req.body);
//     if (Array.isArray(files)) {
//         await Promise.all(files.map(async (file) => {
//             try {
//                 const resource_type: ResourceTypes = body.resource_type;
//                 const resource_folder = body.resource_folder;
//                 const media = await createMedia(file, resource_type, resource_folder);
//                 if (!media) {
//                     throw new Error(ERRORS.MEDIA_NOT_FOUND);
//                 }
//                 const resource = await ResourceModel.create({
//                     resource_name: ResourceModel.generateResourceName(media.original_filename, body.user_id),
//                     resource_owner: body.user_id,
//                     resource_type,
//                     resource_state: STATE_RESOURCE.AVAILABLE,
//                 }).catch((err) => {
//                     throw new Error(err);
//                 });
//                 if (!resource) {
//                     throw new Error(ERRORS.FAILED_TO_CREATE_RESOURCE);
//                 }

//                 resource.assignMedia({
//                     media_source: media.secure_url,
//                     media_public_id: media.public_id,
//                     media_signature: media.signature,
//                     media_url: media.url
//                 });

//                 await resource.save().catch((err) => {
//                     throw new Error(err);
//                 });

//                 res.status(200).json({
//                     status: 'success',
//                     data: toPublicDoc(resource)
//                 })
//             } catch (err) {
//                 res.status(500).json({
//                     message: ERRORS.INTERNAL_SERVER_ERROR,
//                     status: 'error'
//                 });
//             }
//         }));
//     } else {
//         res.status(400).json({
//             message: ERRORS.MEDIA_NOT_FOUND,
//             status: 'error'
//         });
//     }
// });

// type RequestPostMedia = ApiRequest<Partial<Resource>> & { files: Express.Multer.File[] };



router.get('/:id', idQuery(), async (req: ApiRequest, res: ApiResponse<PublicResource>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findById(id).then((resource) => {
        if (!resource) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(resource)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

router.put('/:id',idQuery(), async (req: ApiRequest, res: ApiResponse<PublicResource>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findById(id).then((resource) => {
        if (!resource) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        resource.set(req.body);
        resource.save().then((result) => {
            res.status(200).json({
                status: 'success',
                data: toPublicDoc(result)
            });
        }).catch((err) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }).catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/resources/:id/attachments
router.get('/:id/attachments', idQuery(),async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<Attachment[]>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findById(id).then((resource) => {
        if (!resource) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({
            status: 'success',
            data: resource.resource_attachments
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/resources/:id/attachments/:attachment_reference
router.post('/:id/attachments/:attachment_reference', idQuery('id', 'attachment_reference'), async (req: ApiRequest<{
    attachment_reference: Types.ObjectId,
    attachment_collection: string,
} & { id: Types.ObjectId }>, res: ApiResponse<PublicAttachment>, next: NextFunction): Promise<void> => {
    const { id: IdResource, attachment_reference, attachment_collection } = req.body;
    ResourceModel.findById(IdResource).then((resource) => {     
        if (!resource) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        const attachment_collection_valid = zModelName.parse(attachment_collection);
        const modelCollection = mongoose.connection.db.collection(attachment_collection);
        modelCollection.findOne({
            _id: attachment_reference
        }).then((found) => {
            if (!found) {
                next(badRequestError({ message: ERRORS.NOT_FOUND }));
                return;
            }
            // create new attachment
            resource.assignAttachment({
                attachment_reference,
                attachment_collection: attachment_collection_valid,
                attachment_state: STATE_ATTACHMENT.ATTACHED
            });
            const attachmentResponse = resource.resource_attachments.find((attachment) => attachment.attachment_reference.toString() === attachment_reference.toString());
            if (!attachmentResponse) {
                next(badRequestError({ message: ERRORS.INTERNAL_SERVER_ERROR }));
                return;
            }
            res.status(200).json({
                status: 'success',
                data: toPublicDoc(attachmentResponse)
            });
        }).catch((err) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }).catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});


router.delete('/:id/attachments/:attachment_id', idQuery('id', 'attachment_id'), async (req: ApiRequest<{ id: Types.ObjectId, attachment_id: Types.ObjectId }>, res: ApiResponse<PublicAttachment>, next: NextFunction): Promise<void> => {
    const { id, attachment_id } = req.body;
    ResourceModel.findById(id).then((resource) => {
        if (!resource) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        const attachment = resource.resource_attachments.find((attachment) => attachment._id.toString() === attachment_id.toString());
        if (!attachment) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        resource.resource_attachments = resource.resource_attachments.filter((attachment) => attachment._id.toString() !== attachment_id.toString());
        resource.save().then(() => {
            res.status(200).json({
                status: 'success',
                data: toPublicDoc(attachment)
            });
            return;
        }).catch((err) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }).catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/resources/:id
router.delete('/:id', idQuery('id') ,async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    ResourceModel.findByIdAndDelete(id).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        Promise.all(result.resource_media.map(async (media) => {
            await cloudinaryImageDeleteMethod(media.media_public_id).catch((err) => {
                throw new Error(err);
            });
        }));
        res.status(200).json({
            status: 'success',
            data: {
                deletedCount: 1
            }
        });
    }).catch((err) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

export default router;