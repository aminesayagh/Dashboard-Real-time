import express from 'express';
const router = express.Router();
import { ApiResponsePagination, ApiRequest, ApiResponse } from "types/Api";
import { ERRORS } from '../constants/ERRORS';
import DepartmentModel, { IDepartmentDocument } from '../model/Department.model';
import LocationModel, { ILocationDocument } from '../model/Location.model';
import qs from 'qs';
import PostulationModel, { IPostulation, IPostulationContentDocument } from '../model/Postulation.model';

router.get('/', async (req: ApiRequest, res: ApiResponsePagination<IDepartmentDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await DepartmentModel.paginate(filter, options).catch((err) => {
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
router.post('/', async (req: ApiRequest, res: ApiResponse<IDepartmentDocument>): Promise<void> => {
    const department = new DepartmentModel(req.body);
    const result = await department.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.send({
        status: 'success',
        data: result.toObject()
    });
});
router.get('/:id', async (req: ApiRequest<any, any, {
    id: string;
}>, res: ApiResponse<IDepartmentDocument>): Promise<void> => {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!department) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: department.toObject()
    });
});
router.put('/:id', async (req: ApiRequest<
    Partial<IDepartmentDocument>,
    {},
    { id: string; }
>, res: ApiResponse<IDepartmentDocument>): Promise<void> => {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!department) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    department.set(req.body);
    const result = await department.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.send({
        status: 'success',
        data: result.toObject()
    });
});
router.delete('/:id', async (req: ApiRequest<any, any, { id: string; }>, res: ApiResponse<IDepartmentDocument>): Promise<void> => {
    const { id } = req.params;
    const department = await DepartmentModel.findByIdAndDelete(id).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!department) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: department.toObject()
    });
});
router.get('/:id/locations', async (req: ApiRequest<any, any, { id: string; }>, res: ApiResponsePagination<ILocationDocument>): Promise<void> => {
    const { id } = req.params;
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await LocationModel.paginate({ ...filter, department_id: id }, options).catch((err) => {
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
router.post('/:id/locations', async (req: ApiRequest<Partial<ILocationDocument>, any, { id: string; }>, res: ApiResponse<ILocationDocument>): Promise<void> => {
    const { id } = req.params;
    const location = new LocationModel({ ...req.body, department_id: id });
    const result = await location.save().catch((err) => {
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
router.get('/:id/locations/:location_id', async (req: ApiRequest<any, any, { id: string; location_id: string; }>, res: ApiResponse<ILocationDocument>): Promise<void> => {
    const { id, location_id } = req.params;
    const location = await LocationModel.findOne({ _id: location_id, department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!location) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: location
    });
});
router.put('/:id/locations/:location_id', async (req: ApiRequest<Partial<ILocationDocument>, any, { id: string; location_id: string; }>, res: ApiResponse<ILocationDocument>): Promise<void> => {
    const { id, location_id } = req.params;
    const location = await LocationModel.findOne({ _id: location_id, department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!location) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    location.set(req.body);
    const result = await location.save().catch((err) => {
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
router.delete('/:id/locations/:location_id', async (req: ApiRequest<any, any, { id: string; location_id: string; }>, res: ApiResponse<ILocationDocument>): Promise<void> => {
    const { id, location_id } = req.params;
    const location = await LocationModel.findOneAndDelete({ _id: location_id, department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!location) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: location
    });
})
router.get('/:id/postulations', async (req: ApiRequest<any, any, { id: string; }>, res: ApiResponsePagination<IPostulation>): Promise<void> => {
    const { id } = req.params;
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await PostulationModel.paginate({ ...filter, postulation_department_id: id }, options).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.json({
        status: 'success',
        data: result
    });
});
router.post('/:id/postulations', async (req: ApiRequest<Partial<IPostulation>, any, { id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id } = req.params;
    const postulation = new PostulationModel({ ...req.body, postulation_department_id: id });
    const result = await postulation.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.json({
        status: 'success',
        data: result
    });
});
router.get('/:id/postulations/:postulation_id', async (req: ApiRequest<any, any, { id: string; postulation_id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id, postulation_id } = req.params;
    const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulation) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.json({
        status: 'success',
        data: postulation
    });
});
router.put('/:id/postulations/:postulation_id', async (req: ApiRequest<Partial<IPostulation>, any, { id: string; postulation_id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id, postulation_id } = req.params;
    const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulation) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    postulation.set(req.body);
    const result = await postulation.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.json({
        status: 'success',
        data: result
    });
});
router.delete('/:id/postulations/:postulation_id', async (req: ApiRequest<any, any, { id: string; postulation_id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id, postulation_id } = req.params;
    const postulation = await PostulationModel.findOneAndDelete({ _id: postulation_id, postulation_department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulation) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.json({
        status: 'success',
        data: postulation
    });
});
router.post('/:id/postulations/:postulation_id/content', async (req: ApiRequest<any, any, { id: string; postulation_id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id, postulation_id } = req.params;
    const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulation) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    postulation.postulation_content.push(req.body);
    const result = await postulation.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.json({
        status: 'success',
        data: result
    });
});
router.put('/:id/postulations/:postulation_id/content/:content_id', async (req: ApiRequest<any, any, { id: string; postulation_id: string; content_id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id, postulation_id, content_id } = req.params;
    const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulation) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    let content = postulation.postulation_content.find((content) => content._id.toString() === content_id);
    if (!content) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    content = { ...content, ...req.body } as IPostulationContentDocument;
    postulation.postulation_content = postulation.postulation_content.map((c) => c._id.toString() === content_id ? content : c);
    const result = await postulation.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.json({
        status: 'success',
        data: result
    });
});
router.delete('/:id/postulations/:postulation_id/content/:content_id', async (req: ApiRequest<any, any, { id: string; postulation_id: string; content_id: string; }>, res: ApiResponse<IPostulation>): Promise<void> => {
    const { id, postulation_id, content_id } = req.params;
    const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!postulation) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    const content = postulation.postulation_content.find((content) => content._id.toString() === content_id);
    if (!content) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    postulation.postulation_content = postulation.postulation_content.filter((content) => content._id.toString() !== content_id);
    const result = await postulation.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.json({
        status: 'success',
        data: result
    });
});

export default router;