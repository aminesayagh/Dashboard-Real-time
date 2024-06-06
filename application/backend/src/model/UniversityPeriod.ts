import { Schema, model } from 'mongoose';
import { PaginateModel } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME, TStatePostulation, STATE_POSTULATION } from 'constants/DB';

export interface IUniversityPeriod {
    period_name: string;
    period_start_date: Date;
    period_end_date: Date;
    period_state: TStatePostulation;
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
    period_start_date: {
        type: Date,
        required: true,
    },
    period_end_date: {
        type: Date,
        required: true,
    },
    period_state: {
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

export default model<IUniversityPeriodDocument, IUniversityPeriodModel>(MODEL_NAME.UNIVERSITY_PERIOD, UniversityPeriodSchema);