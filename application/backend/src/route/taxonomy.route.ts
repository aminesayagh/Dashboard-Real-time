import express from 'express';
import { ITaxonomyDocument } from '../model/Taxonomy.model';
const router = express.Router();
import qs from 'qs';
import { ERRORS } from '../constants/ERRORS';
import TaxonomyModel from '../model/Taxonomy.model';


import { ApiResponse, ApiRequest, ApiResponsePagination } from "types/Api";
import PostulationTypeModel from '../model/PostulationType.model';
import { IPostulationTypeDocument } from '../model/PostulationType.model';
import { Types } from 'mongoose';
import PostulationTypeContentModel, { IPostulationTypeContentDocument } from '../model/PostulationTypeContent.model';

router.get('/', async (req: ApiRequest, res: ApiResponsePagination<ITaxonomyDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await TaxonomyModel.paginate(filter, options).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.post('/', async (req: ApiRequest, res: ApiResponse<ITaxonomyDocument>): Promise<void> => {
    const taxonomy = new TaxonomyModel(req.body);
    const result = await taxonomy.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.get('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<ITaxonomyDocument>) => {
    const { id } = req.params;
    const result = await TaxonomyModel.findById(id).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.put('/:id', async (req: ApiRequest<Partial<ITaxonomyDocument>, {}, { id: string }>, res: ApiResponse<ITaxonomyDocument>) => {
    const { id } = req.params;
    const result = await TaxonomyModel.findByIdAndUpdate(id, req.body).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.delete('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<ITaxonomyDocument>) => {
    const { id } = req.params;
    const result = await TaxonomyModel.findByIdAndDelete(id).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.get('/:id/postulation_types', async (req: ApiRequest, res: ApiResponsePagination<ITaxonomyDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await TaxonomyModel.paginate(filter, options).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.post('/:id/postulation_types', async (req: ApiRequest, res: ApiResponse<ITaxonomyDocument>): Promise<void> => {
    const taxonomy = new TaxonomyModel(req.body);
    const result = await taxonomy.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.get('/:id/postulation_types/:postulation_type_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string }>, res: ApiResponsePagination<IPostulationTypeDocument>): Promise<void> => {
    let { filter, ...options } = qs.parse(req.query) as any;
    filter.taxonomies_id = { $in: [new Types.ObjectId(req.params.id)] };
    const result = await PostulationTypeModel.paginate(filter, options).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.put('/:id/postulation_types/:postulation_type_id', async (req: ApiRequest<Partial<IPostulationTypeDocument>, {}, { id: string, postulation_type_id: string }>, res: ApiResponse<IPostulationTypeDocument>) => {
    const { id, postulation_type_id } = req.params;
    const result = await PostulationTypeModel.findOneAndUpdate({ taxonomies_id: { $in: [new Types.ObjectId(id)] }, _id:  new Types.ObjectId(postulation_type_id) }, req.body).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.delete('/:id/postulation_types/:postulation_type_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string }>, res: ApiResponse<IPostulationTypeDocument>) => {
    const { id, postulation_type_id } = req.params;
    const result = await PostulationTypeModel.findOneAndDelete({ taxonomies_id: { $in: [new Types.ObjectId(id)] }, _id: new Types.ObjectId(postulation_type_id) }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.post('/:id/postulation_types/:postulation_type_id/postulation_type_content', async (req: ApiRequest<Partial<IPostulationTypeContentDocument>, {}, { id: string, postulation_type_id: string }>, res: ApiResponse<IPostulationTypeDocument>) => {
    const { id, postulation_type_id } = req.params;
    const postulationType = await PostulationTypeModel.findOne({ taxonomies_id: { $in: [new Types.ObjectId(id)] }, _id: new Types.ObjectId(postulation_type_id) }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulationType) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    const postulation_type_content = new PostulationTypeContentModel(req.body);
    postulationType.postulation_type_content.push(
        postulation_type_content._id
    );
    const result = await postulationType.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.get('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string, content_id: string }>, res: ApiResponse<IPostulationTypeContentDocument>) => {
    const { content_id } = req.params;
    const result = await PostulationTypeContentModel.findOne({ _id: new Types.ObjectId(content_id) }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.put('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<Partial<IPostulationTypeContentDocument>, {}, { id: string, postulation_type_id: string, content_id: string }>, res: ApiResponse<IPostulationTypeContentDocument>) => {
    const { content_id } = req.params;
    const result = await PostulationTypeContentModel.findByIdAndUpdate(content_id, req.body).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.delete('/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', async (req: ApiRequest<{}, {}, { id: string, postulation_type_id: string, content_id: string }>, res: ApiResponse<IPostulationTypeContentDocument>) => {
    const { content_id } = req.params;
    const result = await PostulationTypeContentModel.findByIdAndDelete(content_id).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});


router.get('/types/:type', async (req: ApiRequest, res: ApiResponsePagination<ITaxonomyDocument>): Promise<void> => {
    let { filter, ...options } = qs.parse(req.query) as any;
    filter = { ...filter, taxonomy_type: req.params.type };
    const result = await TaxonomyModel.paginate(filter, options).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});
router.put('/types/:type', async (req: ApiRequest<Partial<ITaxonomyDocument>, {}, { type: string }>, res: ApiResponse<{
    count: number;
}>) => {
    const { type } = req.params;
    const result = await TaxonomyModel.updateMany({ taxonomy_type: type }, req.body).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: {count: result.modifiedCount}
    });
});
router.delete('/types/:type', async (req: ApiRequest, res: ApiResponse<{
    count: number;
}>) => {
    const { type } = req.params;
    const result = await TaxonomyModel.deleteMany({ taxonomy_type: type }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: {count: result.deletedCount}
    });
});

export default router;