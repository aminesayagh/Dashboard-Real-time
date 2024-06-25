import { Schema, model,  PaginateModel } from 'mongoose';
import { MODEL_NAME, STATE_POSTULATION } from 'shared-ts';
import { IPostulationDocument, IPostulationContentDocument } from 'types/Model';
import mongoosePagination from 'mongoose-paginate-v2';




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


export interface IPostulationModel extends PaginateModel<IPostulationDocument> {};

const PostulationSchema = new Schema<IPostulationDocument, IPostulationModel>({
    resources_id: {
        type: [Schema.Types.ObjectId],
        ref: MODEL_NAME.RESOURCE,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    postulation_department_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.DEPARTMENT,  // Ensure this reference is correct
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

PostulationSchema.plugin(mongoosePagination as any);

const Postulation = model<IPostulationDocument, IPostulationModel>(MODEL_NAME.POSTULATION, PostulationSchema);

Postulation.paginate().then();

export default Postulation;