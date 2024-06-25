import { Schema ,PaginateModel, model } from "mongoose";
import { MODEL_NAME,  } from "shared-ts";
import { IPostulationTypeContentDocument } from 'types/Model';



export interface IPostulationTypeModel extends PaginateModel<IPostulationTypeContentDocument> {};

const PostulationTypeContentSchema = new Schema<IPostulationTypeContentDocument>({
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
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<IPostulationTypeContentDocument>(MODEL_NAME.POSTULATION_TYPE_CONTENT, PostulationTypeContentSchema);