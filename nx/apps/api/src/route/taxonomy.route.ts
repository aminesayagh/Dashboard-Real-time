import express from 'express';
const router = express.Router();
import qs from 'qs';
import { ERRORS } from '../constants/MESSAGE';
import TaxonomyModel from '../model/Taxonomy.model';
import { ITaxonomyDocument } from 'types/Model';


import { ApiResponse, ApiRequest, ApiResponsePagination, IApiDeleteResponse } from "types/Api";
import PostulationTypeModel from '../model/PostulationType.model';
import { IPostulationTypeDocument } from 'types/Model';
import { Types } from 'mongoose';
import PostulationTypeContentModel from '../model/PostulationTypeContent.model';
import { IPostulationTypeContentDocument } from 'types/Model';

router.get('/', async (req: ApiRequest, res: ApiResponsePagination<ITaxonomyDocument>): Promise<void> => {
    try {
        const { filter, ...options } = qs.parse(req.query) as any;
        const result = await TaxonomyModel.paginate(filter, options);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.post('/', async (req: ApiRequest, res: ApiResponse<ITaxonomyDocument>): Promise<void> => {
    try {
        const taxonomy = new TaxonomyModel(req.body);
        const result = await taxonomy.save();
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<ITaxonomyDocument>) => {
    try {
        const { id } = req.params;
        const result = await TaxonomyModel.findById(id);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.put('/:id', async (req: ApiRequest<Partial<ITaxonomyDocument>, {}, { id: string }>, res: ApiResponse<ITaxonomyDocument>) => {
    const { id } = req.params;
    try{
        const result = await TaxonomyModel.findByIdAndUpdate(id, req.body, {new: true})
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.delete('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: IApiDeleteResponse) => {
    const { id } = req.params;
    try{
        const result = await TaxonomyModel.deleteOne({ _id: id });
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: { deletedCount: result.deletedCount }
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/postulation_types', async (req: ApiRequest, res: ApiResponsePagination<IPostulationTypeDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    try{
        const result = await PostulationTypeModel.paginate(filter, options)
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.post('/:id/postulation_types', async (req: ApiRequest, res: ApiResponse<IPostulationTypeDocument>): Promise<void> => {
    try{
        // with the id of the taxonomy
        const taxonomy = await TaxonomyModel.findById(req.params.id)
        if (!taxonomy) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        const postulationType = new PostulationTypeModel(
            {
                ...req.body,
                taxonomies_id: [taxonomy._id]
            }
        );
        const result = await postulationType.save()
        if (!result) {
            res.status(500).json({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/postulation_types/:postulation_type_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string }>, res: ApiResponse<IPostulationTypeDocument>): Promise<void> => {
    try{
        const result = await PostulationTypeModel.findById(req.params.postulation_type_id)
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.put('/:id/postulation_types/:postulation_type_id', async (req: ApiRequest<Partial<IPostulationTypeDocument>, {}, { id: string, postulation_type_id: string }>, res: ApiResponse<IPostulationTypeDocument>) => {
    const { id, postulation_type_id } = req.params;
    try{
        const result = await PostulationTypeModel.findOneAndUpdate({ taxonomies_id: { $in: [new Types.ObjectId(id)] }, _id:  new Types.ObjectId(postulation_type_id) }, req.body, {new: true})
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.delete('/:id/postulation_types/:postulation_type_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string }>, res: IApiDeleteResponse) => {
    const { id, postulation_type_id } = req.params;
    try{
        const result = await PostulationTypeModel.deleteOne({ taxonomies_id: { $in: [new Types.ObjectId(id)] }, _id: new Types.ObjectId(postulation_type_id) })
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: { deletedCount: result.deletedCount}
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.post('/:id/postulation_types/:postulation_type_id/postulation_type_content', async (req: ApiRequest<Partial<IPostulationTypeContentDocument>, {}, { id: string, postulation_type_id: string }>, res: ApiResponse<IPostulationTypeContentDocument>) => {
    const { postulation_type_id } = req.params;
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
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string, content_id: string }>, res: ApiResponse<IPostulationTypeContentDocument>) => {
    const { content_id } = req.params;
    try{
        const result = await PostulationTypeContentModel.findOne({ _id: new Types.ObjectId(content_id) })
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.put('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<Partial<IPostulationTypeContentDocument>, {}, { id: string, postulation_type_id: string, content_id: string }>, res: ApiResponse<IPostulationTypeContentDocument>) => {
    const { content_id } = req.params;
    try{
        const result = await PostulationTypeContentModel.findByIdAndUpdate(content_id, req.body, {new: true})
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.delete('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string, content_id: string }>, res: IApiDeleteResponse) => {
    const { content_id } = req.params;
    try{
        const result = await PostulationTypeContentModel.deleteOne({_id: content_id})
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: { deletedCount: result.deletedCount}
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});


router.get('/types/:type', async (req: ApiRequest, res: ApiResponsePagination<ITaxonomyDocument>): Promise<void> => {
    let { filter, ...options } = qs.parse(req.query) as any;
    filter = { ...filter, taxonomy_type: req.params.type };
    try{
        const result = await TaxonomyModel.paginate(filter, options)
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.put('/types/:type', async (req: ApiRequest<Partial<ITaxonomyDocument>, {}, { type: string }>, res: ApiResponse<{
    count: number;
}>) => {
    const { type } = req.params;
    try{
        const result = await TaxonomyModel.updateMany({ taxonomy_type: type }, req.body, {new: true})
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {count: result.modifiedCount}
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});
router.delete('/types/:type', async (req: ApiRequest, res: IApiDeleteResponse) => {
    const { type } = req.params;
    try{
        const result = await TaxonomyModel.deleteMany({ taxonomy_type: type })
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {deletedCount: result.deletedCount}
        });
    }catch (err:any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

export default router;