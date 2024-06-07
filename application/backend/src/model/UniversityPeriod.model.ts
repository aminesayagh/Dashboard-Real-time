import { Schema, model, PaginateModel, Types } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME, TStatePostulation, STATE_POSTULATION } from 'constants/DB';

export interface IUniversityPeriod {
    period_name: string;
    period_date_start: Date;
    period_date_end: Date;
    period_state: TStatePostulation;
    period_next?: Types.ObjectId;
    period_previous?: Types.ObjectId;
}

export interface IUniversityPeriodDocument extends DefaultDocument<IUniversityPeriod> {};

export interface IUniversityPeriodModel extends PaginateModel<IUniversityPeriodDocument> {};

const UniversityPeriodSchema = new Schema<IUniversityPeriodDocument, IUniversityPeriodModel>({
    period_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    period_date_start: {
        type: Date,
        required: true,
    },
    period_date_end: {
        type: Date,
        required: true,
    },
    period_state: {
        type: String,
        required: true,
        enum: Object.values(STATE_POSTULATION),
        default: STATE_POSTULATION.ON_HOLD,
    },
    period_next: {
        type: Schema.Types.ObjectId,
        ref: MODEL_NAME.UNIVERSITY_PERIOD,
    },
    period_previous: {
        type: Schema.Types.ObjectId,
        ref: MODEL_NAME.UNIVERSITY_PERIOD,
    },
    
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

export default model<IUniversityPeriodDocument, IUniversityPeriodModel>(MODEL_NAME.UNIVERSITY_PERIOD, UniversityPeriodSchema);