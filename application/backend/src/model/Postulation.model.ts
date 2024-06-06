import { Schema, model, Types } from 'mongoose';
import { PaginateModel } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME, TStatePostulation, STATE_POSTULATION } from 'constants/DB';

export interface IPostulation {
    resources_id: Types.ObjectId[];
    user_id: Types.ObjectId;
    postulation_state: TStatePostulation;
    postulation_type: Types.ObjectId;
}

export interface IPostulationDocument extends DefaultDocument<IPostulation> {};

export interface IPostulationModel extends PaginateModel<IPostulationDocument> {};

const PostulationSchema = new Schema<IPostulationDocument, IPostulationModel>({
    resources_id: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: MODEL_NAME.RESOURCE,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    postulation_state: {
        type: String,
        required: true,
        enum: Object.values(STATE_POSTULATION),
        default: STATE_POSTULATION.ON_HOLD,
    },
    postulation_type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.POSTULATION,
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<IPostulationDocument, IPostulationModel>(MODEL_NAME.POSTULATION, PostulationSchema);

