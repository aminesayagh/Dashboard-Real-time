import { PaginateModel, Schema, model, HydratedDocument, Model } from 'mongoose';
import { MODEL_NAME, STATE_POSTULATION } from '@org/shared-ts';
import { Taxonomy } from '../types/Models';
import mongoosePagination from 'mongoose-paginate-v2';

type TaxonomyMethods = unknown;

type TaxonomyStatics = unknown;

type TaxonomyVirtual = unknown;

export type TaxonomyModel = Model<Taxonomy, unknown, TaxonomyMethods, TaxonomyVirtual> & TaxonomyStatics & PaginateModel<Taxonomy>;
export type HydratedTaxonomy = HydratedDocument<Taxonomy, TaxonomyMethods & TaxonomyVirtual>;


const TaxonomySchema = new Schema<Taxonomy, TaxonomyModel, TaxonomyMethods, TaxonomyVirtual>({
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
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

TaxonomySchema.plugin(mongoosePagination);

const Taxonomy = model<Taxonomy, TaxonomyModel>(MODEL_NAME.TAXONOMY, TaxonomySchema);


export default Taxonomy;