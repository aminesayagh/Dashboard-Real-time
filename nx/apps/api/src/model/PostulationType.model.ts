import { Schema, model, Model, HydratedDocument } from "mongoose";
import { MODEL_NAME } from "shared-ts";
import { PostulationType } from "types/Models";

interface PostulationTypeMethods {}

interface PostulationTypeStatics {}

interface PostulationTypeVirtual {}

export type PostulationTypeModel = Model<PostulationType, {}, PostulationTypeMethods, PostulationTypeVirtual> & PostulationTypeStatics;
export type HydratedPostulationTypeContent = HydratedDocument<PostulationType, PostulationTypeMethods & PostulationTypeVirtual>;

// export interface IPostulationTypeModel extends PaginateModel<IPostulationTypeDocument> {};

const PostulationTypeSchema = new Schema<PostulationType, PostulationTypeModel, PostulationTypeMethods, PostulationTypeVirtual>({
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
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

const PostulationType = model<PostulationType, PostulationTypeModel>(MODEL_NAME.POSTULATION_TYPE, PostulationTypeSchema, MODEL_NAME.POSTULATION_TYPE.toLowerCase());

export default PostulationType;