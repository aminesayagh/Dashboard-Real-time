import { Schema, model, Model, HydratedDocument, PaginateModel } from "mongoose";
import { MODEL_NAME } from "@org/shared-ts";
import mongoosePagination from "mongoose-paginate-v2";
import { PostulationType } from "../types/Models";

export type PostulationTypeModel = Model<PostulationType> &  PaginateModel<PostulationType>;
export type HydratedPostulationType = HydratedDocument<PostulationType>;

const PostulationTypeSchema = new Schema<PostulationType, PostulationTypeModel>({
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
PostulationTypeSchema.plugin(mongoosePagination as any);

const PostulationType = model<PostulationType, PostulationTypeModel>(MODEL_NAME.POSTULATION_TYPE, PostulationTypeSchema, MODEL_NAME.POSTULATION_TYPE.toLowerCase());

export default PostulationType;