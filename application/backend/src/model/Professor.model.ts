import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import { MODEL_NAME, STATE_PROFESSOR_ARRAY, STATE_PROFESSOR, TStateProfessor } from '../constants/DB';
import { DefaultDocument } from 'types/Mongoose';
import { ERRORS } from '../constants/ERRORS';

interface IProfessor {
    user_id: Schema.Types.ObjectId;
    professor_office_location: string;
    professor_state: TStateProfessor;
}

export interface IProfessorDocument extends DefaultDocument<IProfessor> {}

export interface IProfessorModel extends PaginateModel<IProfessorDocument> {}

const professorSchema = new Schema<IProfessorDocument, IProfessorModel>({
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
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

professorSchema.pre('save', async function (this: IProfessorDocument, next) {
    const user = await this.model(MODEL_NAME.USER).findById(this.user_id);
    if (!user) {
        next(new Error(ERRORS.USER_NOT_FOUND));
    }
    next();
});

professorSchema.plugin(mongoosePagination as any);

export const Professor = model<IProfessorDocument, IProfessorModel>(MODEL_NAME.PROFESSOR, professorSchema);

Professor.paginate().then();

export default Professor;