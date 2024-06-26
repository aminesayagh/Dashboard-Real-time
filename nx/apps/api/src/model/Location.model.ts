import { Schema, model, Model, HydratedDocument } from 'mongoose';
import { MODEL_NAME } from 'shared-ts';
import mongoosePagination from 'mongoose-paginate-v2';
import { Location } from '../types/Models';

interface LocationMethods {}

interface LocationStatics {}

interface LocationVirtual {}

export type LocationModel = Model<Location, {}, LocationMethods, LocationVirtual> & LocationStatics; 
export type HydratedLocation = HydratedDocument<Location, LocationMethods & LocationVirtual>;  

const LocationSchema = new Schema<Location, LocationModel, LocationMethods, LocationVirtual>({
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
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

LocationSchema.plugin(mongoosePagination as any);

const Location = model<Location, LocationModel>(MODEL_NAME.LOCATION, LocationSchema, MODEL_NAME.LOCATION.toLowerCase());


export default Location;