import { Schema, Types ,PaginateModel, model } from "mongoose";
import { DefaultDocument } from "types/Mongoose";
import { MODEL_NAME } from "constants/DB";

export interface IInscriptionType {
    taxonomies_id: Types.ObjectId[];
    postulation_type_period: Types.ObjectId[];
    postulation_type_name: string;
    postulation_type_content: Types.ObjectId[];
}

export interface IInscriptionTypeDocument extends DefaultDocument<IInscriptionType> {};

export interface IInscriptionTypeModel extends PaginateModel<IInscriptionTypeDocument> {};

const InscriptionTypeSchema = new Schema<IInscriptionTypeDocument, IInscriptionTypeModel>({
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

export default model<IInscriptionTypeDocument, IInscriptionTypeModel>(MODEL_NAME.POSTULATION_TYPE, InscriptionTypeSchema);