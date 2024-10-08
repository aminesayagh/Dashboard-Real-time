import {
  Schema,
  model,
  Model,
  HydratedDocument,
  PaginateModel,
} from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { MODEL_NAME } from '@rtd/shared-ts';

import { Department } from '../types/Models';

export type DepartmentModel = Model<Department> & PaginateModel<Department>;
export type HydratedDepartment = HydratedDocument<Department>;

const DepartmentSchema = new Schema<Department, DepartmentModel>(
  {
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
    },
  },
  {
    strict: true,
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
DepartmentSchema.plugin(paginate as any);

const Department = model<Department, DepartmentModel>(
  MODEL_NAME.DEPARTMENT,
  DepartmentSchema,
  MODEL_NAME.DEPARTMENT.toLowerCase(),
);

export default Department;
