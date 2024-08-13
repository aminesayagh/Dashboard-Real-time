import {
  PaginateModel,
  Schema,
  model,
  HydratedDocument,
  Model,
} from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { MODEL_NAME, STATE_POSTULATION } from '@rtd/shared-ts';
import { Taxonomy } from '../types/Models';

export type TaxonomyModel = Model<Taxonomy, unknown> & PaginateModel<Taxonomy>;
export type HydratedTaxonomy = HydratedDocument<Taxonomy>;

const TaxonomySchema = new Schema<Taxonomy, TaxonomyModel>(
  {
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
    },
  },
  {
    strict: true,
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
TaxonomySchema.plugin(paginate as any);

const Taxonomy = model<Taxonomy, TaxonomyModel>(
  MODEL_NAME.TAXONOMY,
  TaxonomySchema,
  MODEL_NAME.TAXONOMY.toLowerCase(),
);

export default Taxonomy;
