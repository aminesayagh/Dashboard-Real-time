import { Schema, model, Types } from 'mongoose';
import { PaginateModel } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME, STATE_POSTULATION } from '../constants/DB';

export interface ITaxonomy {
    taxonomy_type: string;
    taxonomy_value: string;
    taxonomy_parent_id: Types.ObjectId;
    taxonomy_level: number;
    taxonomy_responsible_id: Types.ObjectId;
    taxonomy_state: string;
}

export interface ITaxonomyDocument extends DefaultDocument<ITaxonomy> {};

export interface ITaxonomyModel extends PaginateModel<ITaxonomyDocument> {};

const TaxonomySchema = new Schema<ITaxonomyDocument, ITaxonomyModel>({
    taxonomy_type: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    taxonomy_value: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    taxonomy_parent_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.TAXONOMY,
    },
    taxonomy_level: {
        type: Number,
        required: true,
    },
    taxonomy_responsible_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    taxonomy_state: {
        type: String,
        required: true,
        enum: Object.values(STATE_POSTULATION),
        default: STATE_POSTULATION.ON_HOLD,
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<ITaxonomyDocument, ITaxonomyModel>(MODEL_NAME.TAXONOMY, TaxonomySchema);