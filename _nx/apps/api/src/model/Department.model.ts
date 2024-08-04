import { Schema, model, Model, HydratedDocument, PaginateModel } from 'mongoose';
import { MODEL_NAME } from 'shared-ts';
import mongoosePagination from 'mongoose-paginate-v2';
import { Department } from '../types/Models';

interface DepartmentMethods {}  

interface DepartmentStatics {}

interface DepartmentVirtual {}

export type DepartmentModel = Model<Department, {}, DepartmentMethods, DepartmentVirtual> & DepartmentStatics & PaginateModel<Department>;
export type HydratedDepartment = HydratedDocument<Department, DepartmentMethods & DepartmentVirtual>;


const DepartmentSchema = new Schema<Department, DepartmentModel, DepartmentMethods, DepartmentVirtual>({
    department_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    responsible_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

DepartmentSchema.plugin(mongoosePagination as any);

const Department = model<Department, DepartmentModel>(MODEL_NAME.DEPARTMENT, DepartmentSchema, MODEL_NAME.DEPARTMENT.toLowerCase());


export default Department; 