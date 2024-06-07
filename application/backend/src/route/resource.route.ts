import express from 'express';
import { ERRORS } from 'constants/ERRORS';
import { ApiRequest, ApiResponse } from 'types/Api';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser';
import path from 'path';
import z from 'zod';

const zodResourceType = z.enum(['image', 'video', 'raw', 'auto']);
const zodBodyMedia = z.object({
    resource_type: zodResourceType.default('auto'),
    resource_folder: z.string(),
    user_id: z.string(),
});

import ResourceModel, { IResourceDocument } from 'src/model/Resource.model';
const router = express.Router();

import { 
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME
} from 'env';
import { STATE_RESOURCE } from 'src/constants/DB';

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const generateRandomNumber = () => Math.floor(Math.random() * 1000);
type ResourceTypes = 'image' | 'video' | 'raw' | 'auto';
const createMedia = async (file: Express.Multer.File, resource_type: ResourceTypes, resource_folder: string) => {
    const parser = new DatauriParser();
    const base64Image = parser.format(path.extname(`${file.originalname}_${generateRandomNumber()}`).toString(), file.buffer);
    if (!base64Image || !base64Image.content) {
        throw new Error(ERRORS.FAILED_TO_GENERATE_BASE64);
    }
    try {
        return await cloudinary.uploader.upload(base64Image.content, {
            resource_type,
            folder: resource_folder,
        });
    } catch (err) {
        throw new Error(ERRORS.FAILED_UPDATING_MEDIA);
    }
}
router.post('/:resource_folder/', multer().any(), async (req: ApiRequest<
    Partial<IResourceDocument> & { file: Express.Multer.File[] }, any, { resource_type: ResourceTypes, resource_folder: string }
    >, res: ApiResponse<IResourceDocument>): Promise<void> => {
    const files = req.files;
    const { resource_folder } = req.params;
    if (!files) {
        res.status(400).json({
            message: ERRORS.MEDIA_NOT_FOUND,
            status: 'error'
        });
    }
    const body = zodBodyMedia.parse(req.body);
    if (Array.isArray(files)) {
        await Promise.all(files.map(async (file) => {
            try {
                const resource_type: ResourceTypes = body.resource_type;
                const media = await createMedia(file, resource_type, resource_folder);
                if (!media) {
                    throw new Error(ERRORS.MEDIA_NOT_FOUND);
                }
                const resource = await ResourceModel.create({
                    resource_name: file.originalname,
                    resource_media: [{
                        media_source: media.secure_url,
                        media_public_id: media.public_id,
                        media_signature: media.signature,
                        media_url: media.url,
                    }],
                    resource_owner: body.user_id,
                    resource_type,
                    resource_state: STATE_RESOURCE.AVAILABLE,
                }).catch((err) => {
                    throw new Error(err);
                });
                const data = resource.toObject();
                res.status(200).json({
                    status: 'success',
                    data
                })
            } catch (err) {
                console.error(err);
                res.status(500).json({
                    message: ERRORS.INTERNAL_SERVER_ERROR,
                    status: 'error'
                });
            }
        }));
    } else {
        res.status(400).json({
            message: ERRORS.MEDIA_NOT_FOUND,
            status: 'error'
        });
    }
});

router.get('/', async () => {});
router.put('/:id', async () => {});
router.get('/:id', async () => {});
router.put('/:id/attachment', async () => {});
router.get('/:id/attachment', async () => {});
router.post('/:id/attachment', async () => {});
router.delete('/:id/attachment/:attachment_id', async () => {});

export default router;