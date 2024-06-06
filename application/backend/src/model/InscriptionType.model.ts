import { Schema, Types ,PaginateModel, model } from "mongoose";
import { DefaultDocument } from "types/Mongoose";
import { MODEL_NAME } from "constants/DB";

export interface IInscriptionType {
    taxonomies_id: Types.ObjectId[];
    inscription_period: Types.ObjectId[];
    inscription_name: string;
}

export interface IInscriptionTypeDocument extends DefaultDocument<IInscriptionType> {};

export interface IInscriptionTypeModel extends PaginateModel<IInscriptionTypeDocument> {};

const InscriptionTypeSchema = new Schema<IInscriptionTypeDocument, IInscriptionTypeModel>({
    taxonomies_id: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: MODEL_NAME.TAXONOMY,
    },
    inscription_period: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: MODEL_NAME.UNIVERSITY_PERIOD,
    },
    inscription_name: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<IInscriptionTypeDocument, IInscriptionTypeModel>(MODEL_NAME.INSCRIPTION_TYPE, InscriptionTypeSchema);