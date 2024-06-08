import { Schema, model, Types, PaginateModel, ObjectId } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME, TStatePostulation, STATE_POSTULATION } from 'constants/DB';

export interface IPostulationContent {
    postulation_content_body: ObjectId;
    postulation_content_type: ObjectId;
}

export interface IPostulationContentDocument extends DefaultDocument<IPostulationContent> {};

const PostulationContentSchema = new Schema<IPostulationContentDocument>({
    postulation_content_body: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    postulation_content_type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.POSTULATION_TYPE_CONTENT,
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export interface IPostulation {
    resources_id: Types.ObjectId[];
    user_id: Types.ObjectId;
    postulation_department_id: Types.ObjectId;
    postulation_state: TStatePostulation;
    postulation_type: Types.ObjectId;
    postulation_content: IPostulationContentDocument[];
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
    },
    postulation_content: [PostulationContentSchema]
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<IPostulationDocument, IPostulationModel>(MODEL_NAME.POSTULATION, PostulationSchema);