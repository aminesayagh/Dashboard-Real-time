import multer from 'multer';
import { v2 as cloud, UploadApiResponse } from 'cloudinary';
import { 
    CLOUD_API_KEY,
    CLOUD_API_SECRET,
    CLOUD_CLOUD_NAME
} from '../env';
import { ERRORS } from '../constants/MESSAGE';

cloud.config({
    cloud_name: CLOUD_CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});
 
const multerStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}-${file.originalname}-${ext}`); // Appending extension, ex: 1234567890-abc.jpg
    }
});

export const upload = multer({ storage: multerStorage });

export const cloudinaryImageUploadMethod = async (file: Express.Multer.File): Promise<UploadApiResponse> => {
    return new Promise((resolve) => {
        cloud.uploader.upload_stream({ resource_type: 'image', folder: 'image' }, (error, result) => {
            if (error) {
                throw new Error(ERRORS.FAILED_UPDATING_MEDIA);
            }
            if (!result) {
                throw new Error(ERRORS.FAILED_UPDATING_MEDIA);
            }
            resolve(result);
        }).end(file.buffer);
    })
}

export const cloudinaryImageDeleteMethod = async (public_id: string) => {
    return new Promise((resolve) => {
        cloud.uploader.destroy(public_id, (error, result) => {
            if (error) {
                throw new Error(ERRORS.FAILED_TO_DELETE_MEDIA);
            }
            resolve(result);
        });
    })
};

export default cloud;