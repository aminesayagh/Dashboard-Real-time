import { Schema, model, PaginateModel, Types } from 'mongoose';
import { DefaultDocument } from 'types/Mongoose';
import { MODEL_NAME, TStatePostulation, STATE_POSTULATION } from '../constants/DB';

export interface IUniversityPeriod {
    period_name: string;
    period_date_start: Date;
    period_date_end: Date;
    period_state: TStatePostulation;
    period_next?: Types.ObjectId;
    period_previous?: Types.ObjectId;
}

interface IUniversityMethod {
    findByPeriodName(period_name: string): Promise<IUniversityPeriodDocument | null>;
    findByDate(date: Date): Promise<IUniversityPeriodDocument | null>;
    findCurrentPeriod(): Promise<IUniversityPeriodDocument | null>;
    updateCurrentPeriod(): Promise<IUniversityPeriodDocument>;
}

export interface IUniversityPeriodDocument extends DefaultDocument<IUniversityPeriod>, IUniversityMethod {};

export interface IUniversityPeriodModel extends PaginateModel<IUniversityPeriodDocument>, IUniversityMethod {};

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
        required: function () {
            if (this.isNew) {
                return true;
            }
            return false;
        },
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

// override the saving method to add the next and previous period to the current period
UniversityPeriodSchema.pre('save', async function (next) {
    if (this.isNew) {
        const previous_period = await this.model(MODEL_NAME.UNIVERSITY_PERIOD).findOne({ period_next: null }) as IUniversityPeriodDocument;
        if (previous_period) {
            previous_period.period_next = this._id;
            this.period_previous = previous_period._id;
            await previous_period.save();
        }
    }
    next();
});

UniversityPeriodSchema.statics.findByPeriodName = async function (period_name: string) {
    return this.findOne({ period_name });
};

UniversityPeriodSchema.statics.findByDate = async function (date: Date) {
    return this.findOne({ period_date_start: { $lte: date }, period_date_end: { $gte: date } });
}

UniversityPeriodSchema.statics.findCurrentPeriod = async function () {
    return this.findOne({ period_date_start: { $lte: new Date() }, period_date_end: { $gte: new Date() } });
}

UniversityPeriodSchema.statics.updateCurrentPeriod = async function (newPeriod: Partial<IUniversityPeriodDocument>) {
    const currentPeriod = await this.findCurrentPeriod() as IUniversityPeriodDocument;
    if (currentPeriod) {
        if (newPeriod.period_state) {
            currentPeriod.period_state = newPeriod.period_state;
        }
        if (newPeriod.period_name) {
            currentPeriod.period_name = newPeriod.period_name;
        }
        if (newPeriod.period_date_start) {
            currentPeriod.period_date_start = newPeriod.period_date_start;
        }
        if (newPeriod.period_date_end) {
            currentPeriod.period_date_end = newPeriod.period_date_end;
        }
        return currentPeriod.save();
    }
    return this.create(newPeriod);
};

export default model<IUniversityPeriodDocument, IUniversityPeriodModel>(MODEL_NAME.UNIVERSITY_PERIOD, UniversityPeriodSchema);