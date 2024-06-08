import { Schema, model, Types } from 'mongoose';
import { PaginateModel } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME } from '../constants/DB';

export interface ILocation {
    location_name: string;
    location_reference: string;
    department_id: Types.ObjectId;
}

export interface ILocationDocument extends DefaultDocument<ILocation> {};
export interface ILocationModel extends PaginateModel<ILocationDocument> {};

const LocationSchema = new Schema<ILocationDocument, ILocationModel>({
    location_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    location_reference: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    department_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.DEPARTMENT,
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<ILocationDocument, ILocationModel>(MODEL_NAME.LOCATION, LocationSchema);