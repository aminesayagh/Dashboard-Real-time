import { Schema, model, PaginateModel, ObjectId } from 'mongoose';
import { MODEL_NAME } from 'shared-ts';
import mongoosePagination from 'mongoose-paginate-v2';
import { ILocationDocument } from 'types/Model';
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

LocationSchema.plugin(mongoosePagination as any);

const Location = model<ILocationDocument, ILocationModel>(MODEL_NAME.LOCATION, LocationSchema);

Location.paginate().then();

export default model<ILocationDocument, ILocationModel>(MODEL_NAME.LOCATION, LocationSchema);