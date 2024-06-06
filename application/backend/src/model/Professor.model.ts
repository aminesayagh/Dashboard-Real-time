import { Model, Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import { MODEL_NAME, STATE_PROFESSOR_ARRAY, STATE_PROFESSOR, TStateProfessor } from 'constants/DB';
import { DefaultDocument } from 'types/Mongoose';

interface IProfessor {
    user_id: Schema.Types.ObjectId;
    office_location: string;
    state_professor: TStateProfessor;
}

export interface IProfessorDocument extends DefaultDocument<IProfessor> {}

export interface IProfessorModel extends Model<IProfessorDocument> {}

const professorSchema = new Schema<IProfessorDocument, IProfessorModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    office_location: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    state_professor: {
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

professorSchema.plugin(mongoosePagination);

export const Professor = model<IProfessorDocument, IProfessorModel>(MODEL_NAME.PROFESSOR, professorSchema);

export default Professor;