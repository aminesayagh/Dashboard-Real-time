import express, { NextFunction } from 'express';
const router = express.Router();
import qs from 'qs';
import { ERRORS } from '../constants/MESSAGE';
import TaxonomyModel, { HydratedTaxonomy } from '../model/Taxonomy.model';

import { PublicDoc, toPublicDoc } from '../types/Mongoose';


import { ApiResponse, ApiRequest, ApiResponsePagination, ApiDeleteResponse } from "../types/Api";
import PostulationTypeModel, { HydratedPostulationType } from '../model/PostulationType.model';
import { Types } from 'mongoose';
import PostulationTypeContentModel, { HydratedPostulationTypeContent } from '../model/PostulationTypeContent.model';
import { PostulationType, PostulationTypeContent, Taxonomy } from '../types/Models';
import { idQuery, PaginationBody, paginationQuery } from '../middlewares/query';
import { badRequestError } from '../helpers/error/BadRequestError';

type PublicTaxonomy = PublicDoc<HydratedTaxonomy>;
type PublicPostulationType = PublicDoc<HydratedPostulationType>;
type PublicPostulationTypeContent = PublicDoc<HydratedPostulationTypeContent>;

// GET /api/v1/taxonomies
router.get('/', paginationQuery, async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<Taxonomy>, next: NextFunction): Promise<void> => {
    const { filter, limit, page } = req.body;
    TaxonomyModel.paginate(filter, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        } 
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/taxonomies
router.post('/', async (req: ApiRequest, res: ApiResponse<PublicTaxonomy>, next: NextFunction): Promise<void> => {
    const taxonomy = new TaxonomyModel(req.body);
    taxonomy.save().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/taxonomies/:id
router.get('/:id', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicTaxonomy>, next: NextFunction) => {
    const { id } = req.body;
    TaxonomyModel.findById(id).then((result) => {   
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/taxonomies/:id
router.put('/:id', idQuery(), async (req: ApiRequest<Partial<Taxonomy> & { id: Types.ObjectId }>, res: ApiResponse<PublicTaxonomy>, next: NextFunction) => {
    const { id } = req.body;
    TaxonomyModel.findByIdAndUpdate(id, req.body, {new: true}).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/taxonomies/:id
router.delete('/:id', async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiDeleteResponse, next: NextFunction) => {
    const { id } = req.body;
    TaxonomyModel.deleteOne({ _id: id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: result.deletedCount } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/taxonomies/:id/postulation_types
router.get('/:id/postulation_types', paginationQuery, async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<PostulationType>, next: NextFunction): Promise<void> => {
    const { filter, limit, page } = req.body;
    PostulationTypeModel.paginate(filter, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        } 
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/taxonomies/:id/postulation_types
router.post('/:id/postulation_types', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId; }>, res: ApiResponse<PublicPostulationType>, next: NextFunction): Promise<void> => {
    const { id, ...bodyPostulationType } = req.body;
    TaxonomyModel.findById(id).then(async (taxonomy) => {
        if (!taxonomy) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        const postulationType = new PostulationTypeModel({
            ...bodyPostulationType,
            taxonomies_id: [taxonomy._id]
        });
        postulationType.save().then((result) => {
            if (!result) {
                next(badRequestError({ message: ERRORS.BAD_REQUEST }));
                return;
            }
            res.status(200).json({ status: 'success', data: toPublicDoc(result) });
        }).catch((err: Error) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/taxonomies/:id/postulation_types/:postulation_type_id
router.get('/:id/postulation_types/:postulation_type_id', idQuery('id', 'postulation_type_id'), async (req: ApiRequest<{ id: Types.ObjectId, postulation_type_id: Types.ObjectId }>, res: ApiResponse<PublicPostulationType>, next: NextFunction): Promise<void> => {
    const { id, postulation_type_id } = req.body;
    PostulationTypeModel.findOne({ taxonomies_id: { $in: [id] }, _id: postulation_type_id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/taxonomies/:id/postulation_types/:postulation_type_id
router.put('/:id/postulation_types/:postulation_type_id', idQuery('id', 'postulation_type_id'), async (req: ApiRequest<Partial<PublicPostulationType> & { id: Types.ObjectId, postulation_type_id: Types.ObjectId }>, res: ApiResponse<PublicPostulationType>, next: NextFunction) => {
    const { id, postulation_type_id } = req.body;
    PostulationTypeModel.findOneAndUpdate({ taxonomies_id: { $in: [id] }, _id: postulation_type_id }, req.body, {new: true}).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/taxonomies/:id/postulation_types/:postulation_type_id
router.delete('/:id/postulation_types/:postulation_type_id', idQuery('id', 'postulation_type_content'),async (req: ApiRequest<{ id: Types.ObjectId, postulation_type_id: Types.ObjectId }>, res: ApiDeleteResponse, next: NextFunction) => {
    const { id, postulation_type_id } = req.body;
    PostulationTypeModel.deleteOne({ taxonomies_id: { $in: [id] }, _id: postulation_type_id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: result.deletedCount } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content
router.post('/:id/postulation_types/:postulation_type_id/postulation_type_content', 
    idQuery('id', 'postulation_type_id'),
    async (
        req: ApiRequest<Partial<PublicPostulationTypeContent> & { id: Types.ObjectId, postulation_type_id: Types.ObjectId }>, 
        res: ApiResponse<PublicPostulationTypeContent>,
        next: NextFunction
    ) => {
    const { postulation_type_id, id } = req.body;
    PostulationTypeModel.findOne({ taxonomies_id: { $in: [id] }, _id: postulation_type_id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        const postulation_type_content = new PostulationTypeContentModel(req.body);
        result.postulation_type_content.push(
            postulation_type_content._id
        );
        result.save().then(() => {
            postulation_type_content.save().then((result) => {
                if (!result) {
                    next(badRequestError({ message: ERRORS.BAD_REQUEST }));
                    return;
                }
                res.status(200).json({ status: 'success', data: toPublicDoc(result) });
            }).catch((err: Error) => {
                next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
            });
        }).catch((err: Error) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    });
    try{
        const postulationType = await PostulationTypeModel.findOne({_id: new Types.ObjectId(postulation_type_id) })
        if (!postulationType) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        const postulation_type_content = new PostulationTypeContentModel(req.body);
        postulationType.postulation_type_content.push(
            postulation_type_content._id
        );
        await postulationType.save()
        const result = await postulation_type_content.save()
        if (!result) {
            res.status(500).json({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// GET /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content
router.get('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', 
    idQuery('id', 'postulation_type_id', 'content_id'),
    async (
        req: ApiRequest<{ id: Types.ObjectId, postulation_type_id: Types.ObjectId, content_id: Types.ObjectId }>, 
        res: ApiResponse<PublicPostulationTypeContent>, 
        next: NextFunction
    ) => {
    const { content_id } = req.params;
    PostulationTypeContentModel.findOne({ _id: content_id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id
router.put('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<Partial<PostulationTypeContent> & { id: Types.ObjectId, postulation_type_id: Types.ObjectId, content_id: Types.ObjectId }, unknown>, res: ApiResponse<PublicPostulationTypeContent>, next: NextFunction) => {
    const { content_id } = req.body;
    PostulationTypeContentModel.findByIdAndUpdate(content_id, req.body, {new: true}).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id
router.delete('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id',
    idQuery('id', 'postulation_type_id', 'content_id'),
    async (
        req: ApiRequest<{ id: Types.ObjectId, postulation_type_id: Types.ObjectId, content_id: Types.ObjectId }>, 
        res: ApiDeleteResponse,
        next: NextFunction
    ) => {
    const { content_id } = req.body;
    PostulationTypeContentModel.deleteOne({ _id: content_id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: result.deletedCount } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/taxonomies/types/:type
router.get('/types/:type', paginationQuery, 
    async (
        req: ApiRequest<PaginationBody, unknown, {
            type: string;
        }>,
        res: ApiResponsePagination<Taxonomy>,
        next: NextFunction
    ): Promise<void> => {
    const { filter, limit, page } = req.body;
    const { type } = req.params;
    TaxonomyModel.paginate({ ...filter, taxonomy_type: type }, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        } 
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/taxonomies/types/:type
router.put('/types/:type', async (req: ApiRequest<Partial<Taxonomy>, unknown, { type: string }>, res: ApiResponse<{
    count: number;
}>, next: NextFunction) => {
    const { type } = req.params;
    TaxonomyModel.updateMany({ taxonomy_type: type }, req.body, {new: true}).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {count: result.modifiedCount}
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/taxonomies/types/:type
router.delete('/types/:type', async (req: ApiRequest, res: ApiDeleteResponse, next: NextFunction) => {
    const { type } = req.params;
    TaxonomyModel.deleteMany({ taxonomy_type: type }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {deletedCount: result.deletedCount}
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

export default router;