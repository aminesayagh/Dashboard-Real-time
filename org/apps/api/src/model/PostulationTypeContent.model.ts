import { Schema ,Model, model, HydratedDocument } from "mongoose";
import { MODEL_NAME,  } from "@org/shared-ts";
import { PostulationTypeContent } from '../types/Models';

export type PostulationTypeContentModel = Model<PostulationTypeContent>;
export type HydratedPostulationTypeContent = HydratedDocument<PostulationTypeContent>;

const PostulationTypeContentSchema = new Schema<PostulationTypeContent, PostulationTypeContentModel>({
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
    strict: true
});

export default model<PostulationTypeContent, PostulationTypeContentModel>(MODEL_NAME.POSTULATION_TYPE_CONTENT, PostulationTypeContentSchema, MODEL_NAME.POSTULATION_TYPE_CONTENT.toLowerCase());