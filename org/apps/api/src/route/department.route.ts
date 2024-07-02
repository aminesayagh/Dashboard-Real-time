import express, { NextFunction } from 'express';
import { Error, Types } from 'mongoose';

const router = express.Router();
import { ApiResponsePagination, ApiRequest, ApiResponse, ApiDeleteResponse } from "../types/Api";
import { ERRORS } from '../constants/MESSAGE';
import DepartmentModel, { HydratedDepartment } from '../model/Department.model';

import LocationModel, { HydratedLocation } from '../model/Location.model';
import PostulationModel, { HydratedPostulation } from '../model/Postulation.model';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { Department, Location, Postulation } from '../types/Models';
import { idQuery, PaginationBody, paginationQuery } from '../middlewares/query';
import { badRequestError } from '../helpers/error/BadRequestError';


type PublicDepartment = PublicDoc<HydratedDepartment>;
type PublicLocation = PublicDoc<HydratedLocation>;
type PublicPostulation = PublicDoc<HydratedPostulation>;

// GET /api/v1/departments
router.get('/', paginationQuery, async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<Department>, next: NextFunction): Promise<void> => {
    const { filter, limit, page } = req.body;
    DepartmentModel.paginate(filter, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/departments
router.post('/', async (req: ApiRequest, res: ApiResponse<PublicDepartment>, next: NextFunction): Promise<void> => {
    const departmentPost = new DepartmentModel(req.body);
    departmentPost.save().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/departments/:id
router.get('/:id', idQuery(),async (req: ApiRequest<{ id: Types.ObjectId; }>, res: ApiResponse<PublicDepartment>, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    DepartmentModel.findById(id).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

router.put('/:id', idQuery(), async (req: ApiRequest<Partial<Department> & { id: Types.ObjectId; }>, res: ApiResponse<PublicDepartment>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    DepartmentModel.findByIdAndUpdate(id, req.body, { new: true }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

router.delete('/:id', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId; }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    DepartmentModel.findByIdAndDelete(id).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: 1 } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/departments/:id/locations
router.get('/:id/locations', idQuery(), paginationQuery, async (req: ApiRequest<PaginationBody & { id: Types.ObjectId; }>, res: ApiResponsePagination<Location>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    const { filter, limit, page } = req.body;
    LocationModel.paginate({ ...filter, department_id: id }, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    })
    
});

// POST /api/v1/departments/:id/locations
router.post('/:id/locations', idQuery(), async (
    req: ApiRequest<Partial<Location> & { id: Types.ObjectId; }>, 
    res: ApiResponse<PublicLocation>, 
    next: NextFunction): Promise<void> => {
    const { id } = req.body;
    const location = new LocationModel({ ...req.body, department_id: id });
    location.save().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/departments/:id/locations/:location_id
router.get('/:id/locations/:location_id', idQuery('id', 'location_id'),async (req: ApiRequest<{ id: Types.ObjectId; location_id: Types.ObjectId; }>, res: ApiResponse<PublicLocation>, next: NextFunction): Promise<void> => {
    const { id, location_id } = req.body;
    LocationModel.findOne({ _id: location_id, department_id: id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/departments/:id/locations/:location_id
router.put('/:id/locations/:location_id', idQuery('id', 'location_id'), async (
    req: ApiRequest<Partial<Location> & { id: Types.ObjectId; location_id: Types.ObjectId; }>, 
    res: ApiResponse<PublicLocation>, 
    next: NextFunction
): Promise<void> => {
    const { id, location_id } = req.body;
    LocationModel.findOneAndUpdate({ _id: location_id, department_id: id }, req.body, { new: true }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/departments/:id/locations/:location_id
router.delete('/:id/locations/:location_id', idQuery('id', 'location_id'), async (req: ApiRequest<{ id: Types.ObjectId; location_id: Types.ObjectId; }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
    const { id, location_id } = req.body;
    LocationModel.findOneAndDelete({ _id: location_id, department_id: id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: 1 } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/departments/:id/postulations
router.get('/:id/postulations',idQuery(), paginationQuery, async (req: ApiRequest<PaginationBody & { id: Types.ObjectId; }>, res: ApiResponsePagination<Postulation>, next: NextFunction): Promise<void> => {
    const { filter, limit, page, id } = req.body;
    PostulationModel.paginate({ ...filter, postulation_department_id: id }, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/departments/:id/postulations
router.post('/:id/postulations', idQuery(), async (req: ApiRequest<Partial<Postulation> & { id: Types.ObjectId; }>, res: ApiResponse<PublicPostulation>, next: NextFunction): Promise<void> => {
    const { id, ...bodyPostulation } = req.body;
    const postulation = new PostulationModel({ ...bodyPostulation, postulation_department_id: id });
    postulation.save().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/departments/:id/postulations/:postulation_id
router.get('/:id/postulations/:postulation_id', idQuery('id', 'postulation_id'), async (req: ApiRequest<{ id: Types.ObjectId; postulation_id: Types.ObjectId; }>, res: ApiResponse<PublicPostulation>, next: NextFunction): Promise<void> => {
    const { id, postulation_id } = req.body;
    PostulationModel.findOne({ _id: postulation_id, postulation_department_id: id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/departments/:id/postulations/:postulation_id
router.put('/:id/postulations/:postulation_id', idQuery('id', 'postulation_id'),async (req: ApiRequest<Partial<Postulation> & { id: Types.ObjectId; postulation_id: Types.ObjectId; }>, res: ApiResponse<PublicPostulation>, next: NextFunction): Promise<void> => {
    const { id, postulation_id } = req.body;
    PostulationModel.findOneAndUpdate({ _id: postulation_id, postulation_department_id: id }, req.body, { new: true }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/departments/:id/postulations/:postulation_id
router.delete('/:id/postulations/:postulation_id', idQuery('id', 'postulation_id'),async (req: ApiRequest<{ id: Types.ObjectId; postulation_id: Types.ObjectId; }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
    const { id, postulation_id } = req.body;
    PostulationModel.findOneAndDelete({ _id: postulation_id, postulation_department_id: id }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: 1 } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

export default router;
