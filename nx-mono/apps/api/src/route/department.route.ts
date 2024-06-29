import express from 'express';
const router = express.Router();
import { ApiResponsePagination, ApiRequest, ApiResponse, IApiDeleteResponse } from "types/Api";
import { ERRORS } from 'constants/MESSAGE';
import DepartmentModel, { HydratedDepartment } from 'model/Department.model';

import LocationModel, { HydratedLocation } from 'model/Location.model';
import qs from 'qs';
import PostulationModel, { HydratedPostulation } from 'model/Postulation.model';
import { PublicDoc, toPublicDoc } from '@/types/Mongoose';
import { Department, Location, Postulation } from 'types/Models';

type PublicDepartment = PublicDoc<HydratedDepartment>;
type PublicLocation = PublicDoc<HydratedLocation>;
type PublicPostulation = PublicDoc<HydratedPostulation>;

router.get('/', async (req: ApiRequest, res: ApiResponsePagination<Department>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    try {
        const result = await DepartmentModel.paginate(filter, options);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.json({
            status: 'success',
            data: result
        });
    }
    catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.post('/', async (req: ApiRequest, res: ApiResponse<PublicDepartment>): Promise<void> => {
    try {
        const department = new DepartmentModel(req.body);
        const result = await department.save();
        if (!result) {
            res.status(500).json({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(result)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id', async (req: ApiRequest<any, any, { id: string; }>, res: ApiResponse<PublicDepartment>): Promise<void> => {
    const { id } = req.params;
    try {
        const department = await DepartmentModel.findById(id);
        if (!department) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(department)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.put('/:id', async (req: ApiRequest<Partial<Department>, {}, { id: string; }>, res: ApiResponse<PublicDepartment>): Promise<void> => {
    const { id } = req.params;
    try {
        const department = await DepartmentModel.findById(id);
        if (!department) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        department.set(req.body);
        const result = await department.save();
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(result)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.delete('/:id', async (req: ApiRequest<any, any, { id: string; }>, res: IApiDeleteResponse): Promise<void> => {
    const { id } = req.params;
    try {
        const department = await DepartmentModel.findByIdAndDelete(id);
        if (!department) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: department.toObject()
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/locations', async (req: ApiRequest<any, any, { id: string; }>, res: ApiResponsePagination<Location>): Promise<void> => {
    const { id } = req.params;
    const { filter, ...options } = qs.parse(req.query) as any;
    try {
        const result = await LocationModel.paginate({ ...filter, department_id: id }, options);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.post('/:id/locations', async (req: ApiRequest<Partial<Location>, any, { id: string; }>, res: ApiResponse<PublicLocation>): Promise<void> => {
    const { id } = req.params;
    try {
        const location = new LocationModel({ ...req.body, department_id: id });
        const result = await location.save();
        if (!result) {
            res.status(500).json({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(result)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/locations/:location_id', async (req: ApiRequest<any, any, { id: string; location_id: string; }>, res: ApiResponse<PublicLocation>): Promise<void> => {
    const { id, location_id } = req.params;
    try {
        const location = await LocationModel.findOne({ _id: location_id, department_id: id });
        if (!location) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(location)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.put('/:id/locations/:location_id', async (req: ApiRequest<Partial<Location>, any, { id: string; location_id: string; }>, res: ApiResponse<PublicLocation>): Promise<void> => {
    const { id, location_id } = req.params;
    try {
        const location = await LocationModel.findOne({ _id: location_id, department_id: id });
        if (!location) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        location.set(req.body);
        const result = await location.save();
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(result)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.delete('/:id/locations/:location_id', async (req: ApiRequest<unknown, unknown, { id: string; location_id: string; }>, res: IApiDeleteResponse): Promise<void> => {
    const { id, location_id } = req.params;
    try {
        const location = await LocationModel.findOneAndDelete({ _id: location_id, department_id: id });
        if (!location) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {
                deletedCount: 1
            }
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/postulations', async (req: ApiRequest<any, any, { id: string; }>, res: ApiResponsePagination<Postulation>): Promise<void> => {
    const { id } = req.params;
    const { filter, ...options } = qs.parse(req.query) as any;
    try {
        const result = await PostulationModel.paginate({ ...filter, postulation_department_id: id }, options);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.post('/:id/postulations', async (req: ApiRequest<Partial<Postulation>, any, { id: string; }>, res: ApiResponse<PublicPostulation>): Promise<void> => {
    const { id } = req.params;
    try {
        const postulation = new PostulationModel({ ...req.body, postulation_department_id: id });
        const result = await postulation.save();
        if (!result) {
            res.status(500).json({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: result.toObject()
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.get('/:id/postulations/:postulation_id', async (req: ApiRequest<any, any, { id: string; postulation_id: string; }>, res: ApiResponse<PublicPostulation>): Promise<void> => {
    const { id, postulation_id } = req.params;
    try {
        const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id });
        if (!postulation) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: toPublicDoc(postulation)
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.put('/:id/postulations/:postulation_id', async (req: ApiRequest<Partial<Postulation>, any, { id: string; postulation_id: string; }>, res: ApiResponse<PublicPostulation>): Promise<void> => {
    const { id, postulation_id } = req.params;
    try {
        console.log(await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }))
        const postulation = await PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id });
        if (!postulation) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        postulation.set(req.body);
        const result = await postulation.save();
        res.status(200).json({
            status: 'success',
            data: result.toObject()
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

router.delete('/:id/postulations/:postulation_id', async (req: ApiRequest<unknown, unknown, { id: string; postulation_id: string; }>, res: IApiDeleteResponse): Promise<void> => {
    const { id, postulation_id } = req.params;
    try {
        const postulation = await PostulationModel.findOneAndDelete({ _id: postulation_id, postulation_department_id: id });
        if (!postulation) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.json({
            status: 'success',
            data: {
                deletedCount: 1
            }
        });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

export default router;
