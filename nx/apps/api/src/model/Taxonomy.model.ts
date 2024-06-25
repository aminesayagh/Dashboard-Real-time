import { Schema, model } from 'mongoose';
import { PaginateModel } from 'mongoose';
import { MODEL_NAME, STATE_POSTULATION } from 'shared-ts';
import mongoosePagination from 'mongoose-paginate-v2';
import { ITaxonomyDocument } from 'types/Model';


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

TaxonomySchema.plugin(mongoosePagination as any);

const Taxonomy = model<ITaxonomyDocument, ITaxonomyModel>(MODEL_NAME.TAXONOMY, TaxonomySchema);

Taxonomy.paginate().then();

export default Taxonomy;