import { Schema ,PaginateModel, model } from "mongoose";
import { DefaultDocument } from "types/Mongoose";
import { MODEL_NAME, IPostulationType } from "shared-ts";
import mongoosePagination from 'mongoose-paginate-v2';



export interface IPostulationTypeDocument extends DefaultDocument<IPostulationType<ObjectId>> {};

export interface IPostulationTypeModel extends PaginateModel<IPostulationTypeDocument> {};

const PostulationTypeSchema = new Schema<IPostulationTypeDocument, IPostulationTypeModel>({
    taxonomies_id: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: MODEL_NAME.TAXONOMY,
    },
    postulation_type_period: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: MODEL_NAME.UNIVERSITY_PERIOD,
    },
    department_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.DEPARTMENT,
    },
    postulation_type_name: {
        type: String,
        required: true,
        trim: true,
    },
    postulation_type_content: {
        type: [Schema.Types.ObjectId],
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

PostulationTypeSchema.plugin(mongoosePagination as any);

const PostulationType = model<IPostulationTypeDocument, IPostulationTypeModel>(MODEL_NAME.POSTULATION_TYPE, PostulationTypeSchema);

PostulationType.paginate().then();

export default PostulationType;