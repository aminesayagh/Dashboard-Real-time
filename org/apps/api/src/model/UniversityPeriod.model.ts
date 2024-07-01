import { Schema, PaginateModel, model, Model, HydratedDocument } from 'mongoose';
import { MODEL_NAME, STATE_POSTULATION } from '@org/shared-ts';
import { UniversityPeriod } from '../types/Models';
import mongoosePagination from 'mongoose-paginate-v2';

interface UniversityStatics {
    findByPeriodName(period_name: string): Promise<HydratedUniversityPeriod | null>;
    findByDate(date: Date): Promise<HydratedUniversityPeriod | null>;
    findCurrentPeriod(): Promise<HydratedUniversityPeriod | null>;
    updateCurrentPeriod(): Promise<HydratedUniversityPeriod>;
}

export type UniversityPeriodModel = Model<UniversityPeriod, unknown> & UniversityStatics & PaginateModel<UniversityPeriod>;
export type HydratedUniversityPeriod = HydratedDocument<UniversityPeriod>;

const UniversityPeriodSchema = new Schema<UniversityPeriod, UniversityPeriodModel>({
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
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

// override the saving method to add the next and previous period to the current period
UniversityPeriodSchema.pre<HydratedUniversityPeriod>('save', async function (next) {
    if (this.isNew) {
        const previous_period = await this.model(MODEL_NAME.UNIVERSITY_PERIOD).findOne({ period_next: null }) as HydratedUniversityPeriod;
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

UniversityPeriodSchema.statics.updateCurrentPeriod = async function (newPeriod) {
    const currentPeriod = await this.findCurrentPeriod() as HydratedUniversityPeriod;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UniversityPeriodSchema.plugin(mongoosePagination as any);

const UniversityPeriod = model<UniversityPeriod, UniversityPeriodModel>(MODEL_NAME.UNIVERSITY_PERIOD, UniversityPeriodSchema, MODEL_NAME.UNIVERSITY_PERIOD.toLocaleLowerCase());


export default UniversityPeriod;