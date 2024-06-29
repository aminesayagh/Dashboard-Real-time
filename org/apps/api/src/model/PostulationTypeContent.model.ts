import { Schema ,Model, model, HydratedDocument } from "mongoose";
import { MODEL_NAME,  } from "@org/shared-ts";
import { PostulationTypeContent } from '../types/Models';

type PostulationTypeContentMethods = never;

type PostulationTypeStatics = never;

type PostulationTypeContentVirtual = never;

export type PostulationTypeContentModel = Model<PostulationTypeContent, never, PostulationTypeContentMethods, PostulationTypeContentVirtual> & PostulationTypeStatics;
export type HydratedPostulationTypeContent = HydratedDocument<PostulationTypeContent>;

// export interface IPostulationTypeModel extends PaginateModel<IPostulationTypeContentDocument> {};

const PostulationTypeContentSchema = new Schema<PostulationTypeContent, PostulationTypeContentModel, PostulationTypeContentMethods, PostulationTypeContentVirtual>({
    postulation_type_content_name: {
        type: String,
        required: true,
        trim: true,
    },
    postulation_type_content_description: {
        type: String,
        required: true,
        trim: true,
    },
    postulation_type_content_type: {
        type: String,
        required: true,
        enum: MODEL_NAME,
        trim: true,
    },
    postulation_type_content_required: {
        type: Boolean,
        default: false,
    },
    postulation_type_content_options: {
        type: [String],
        required: false
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

export default model<PostulationTypeContent, PostulationTypeContentModel>(MODEL_NAME.POSTULATION_TYPE_CONTENT, PostulationTypeContentSchema, MODEL_NAME.POSTULATION_TYPE_CONTENT.toLowerCase());