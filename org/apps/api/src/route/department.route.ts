import { NextFunction } from 'express';
import { Error, Types } from 'mongoose';

import { ApiResponsePagination, ApiRequest, ApiResponse, ApiDeleteResponse } from "../types/Api";
import { ERRORS } from '../constants/MESSAGE';
import DepartmentModel, { HydratedDepartment } from '../model/Department.model';

import LocationModel, { HydratedLocation } from '../model/Location.model';
import PostulationModel, { HydratedPostulation } from '../model/Postulation.model';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { Department, Location, Postulation } from '../types/Models';
import { idQuery, PaginationBody, paginationQuery } from '../middlewares/query';
import { badRequestError } from '../helpers/error/BadRequestError';
import ManagerController from '../helpers/Controller';


type PublicDepartment = PublicDoc<HydratedDepartment>;
type PublicLocation = PublicDoc<HydratedLocation>;
type PublicPostulation = PublicDoc<HydratedPostulation>;


export default class DepartmentController extends ManagerController {
    constructor() {
        super('/departments');
        this.initRoutes();
    }
    private initRoutes() {
        this.router.get('/', paginationQuery, this.getAll);
        this.router.post('/', this.create);
        this.router.get('/:id', idQuery(), this.getOne);
        this.router.put('/:id', idQuery(), this.update);
        this.router.delete('/:id', idQuery(), this.delete);
        this.router.get('/:id/locations', idQuery(), paginationQuery, this.getLocations);
        this.router.post('/:id/locations', idQuery(), this.createLocation);
        this.router.get('/:id/locations/:location_id', idQuery('id', 'location_id'), this.getLocation);
        this.router.put('/:id/locations/:location_id', idQuery('id', 'location_id'), this.updateLocation);
        this.router.delete('/:id/locations/:location_id', idQuery('id', 'location_id'), this.deleteLocation);
        this.router.get('/:id/postulations',idQuery(), paginationQuery, this.getPostulations);
        this.router.post('/:id/postulations', idQuery(), this.createPostulation);
        this.router.get('/:id/postulations/:postulation_id', idQuery('id', 'postulation_id'), this.getPostulation);
        this.router.put('/:id/postulations/:postulation_id', idQuery('id', 'postulation_id'), this.updatePostulation);
        this.router.delete('/:id/postulations/:postulation_id', idQuery('id', 'postulation_id'), this.deletePostulation);
    }
    private getAll = async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<Department>, next: NextFunction): Promise<void> => {
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
    }
    private create = async (req: ApiRequest, res: ApiResponse<PublicDepartment>, next: NextFunction): Promise<void> => {
        const departmentPost = new DepartmentModel(req.body);
        departmentPost.save().then((result) => {  
            if (!result) {
                next(badRequestError({ message: ERRORS.BAD_REQUEST }));
                return;
            }
            res.status(200).json({ status: 'success', data: toPublicDoc(result) });
        }).catch((err: Error) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        }
        );
    }
    private getOne = async (req: ApiRequest<{ id: Types.ObjectId; }>, res: ApiResponse<PublicDepartment>, next: NextFunction): Promise<void> => {
        const { id } = req.body;
        DepartmentModel.findById(id).then((result) => {
            if (!result) {
                next(badRequestError({ message: ERRORS.NOT_FOUND }));
                return;
            }
            res.status(200).json({ status: 'success', data: toPublicDoc(result) });
        }).catch((err: Error) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }
    private update = async (req: ApiRequest<Partial<Department> & { id: Types.ObjectId; }>, res: ApiResponse<PublicDepartment>, next: NextFunction): Promise<void> => {
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
    }
    private delete = async (req: ApiRequest<{ id: Types.ObjectId; }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
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
    }
    private getLocations = async (req: ApiRequest<PaginationBody & { id: Types.ObjectId; }>, res: ApiResponsePagination<Location>, next: NextFunction): Promise<void> => {
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
    }
    private createLocation = async (
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
    }
    private getLocation = async (req: ApiRequest<{ id: Types.ObjectId; location_id: Types.ObjectId; }>, res: ApiResponse<PublicLocation>, next: NextFunction): Promise<void> => {
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
    }
    private updateLocation = async (
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
    }
    private deleteLocation = async (req: ApiRequest<{ id: Types.ObjectId; location_id: Types.ObjectId; }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
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
    }
    private getPostulations = async (req: ApiRequest<PaginationBody & { id: Types.ObjectId; }>, res: ApiResponsePagination<Postulation>, next: NextFunction): Promise<void> => {
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
    }
    private createPostulation = async (req: ApiRequest<Partial<Postulation> & { id: Types.ObjectId; }>, res: ApiResponse<PublicPostulation>, next: NextFunction): Promise<void> => {
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
    }
    private getPostulation = async (req: ApiRequest<{ id: Types.ObjectId; postulation_id: Types.ObjectId; }>, res: ApiResponse<PublicPostulation>, next: NextFunction): Promise<void> => {
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
    }
    private updatePostulation = async (req: ApiRequest<Partial<Postulation> & { id: Types.ObjectId; postulation_id: Types.ObjectId; }>, res: ApiResponse<PublicPostulation>, next: NextFunction): Promise<void> => {
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
    }
    private deletePostulation = async (req: ApiRequest<{ id: Types.ObjectId; postulation_id: Types.ObjectId; }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
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
    }

}
