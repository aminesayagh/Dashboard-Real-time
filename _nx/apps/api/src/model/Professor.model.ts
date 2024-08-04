import { Schema, model, Model, HydratedDocument } from 'mongoose';
import { MODEL_NAME, STATE_PROFESSOR_ARRAY, STATE_PROFESSOR } from 'shared-ts';
import { ERRORS } from '../constants/MESSAGE';
import { Professor } from '../types/Models';

interface ProfessorMethods {}
interface ProfessorStatics {}
interface ProfessorVirtual {}

export type ProfessorModel = Model<Professor, {}, ProfessorMethods, ProfessorVirtual> & ProfessorStatics;
export type HydratedProfessor = HydratedDocument<Professor, ProfessorMethods & ProfessorVirtual>;

const professorSchema = new Schema<Professor, ProfessorModel, ProfessorMethods, ProfessorVirtual>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    professor_office_location: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    professor_state: {
        type: String,
        required: true,
        enum: STATE_PROFESSOR_ARRAY,
        default: STATE_PROFESSOR.ON_HOLD,
    },
}, {
    strict: true,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

professorSchema.pre('save', async function (this, next) {
    const user = await this.model(MODEL_NAME.USER).findById(this.user_id);
    if (!user) {
        next(new Error(ERRORS.USER_NOT_FOUND));
    }
    next();
});


export default model<Professor, ProfessorModel>(MODEL_NAME.PROFESSOR, professorSchema, MODEL_NAME.PROFESSOR.toLowerCase());

