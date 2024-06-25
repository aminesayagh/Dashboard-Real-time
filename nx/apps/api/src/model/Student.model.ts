import { Types, Schema, model, PaginateModel } from 'mongoose';
import { MODEL_NAME, STATE_STUDENT_ARRAY, STATE_STUDENT, TStateStudent, stateStudentRole } from 'shared-ts';
import { ERRORS } from '../constants/MESSAGE';
import { IStudentDocument } from 'types/Model';

export interface IStudentModel extends PaginateModel<IStudentDocument> {
    findByUserId(user_id: Types.ObjectId): Promise<IStudentDocument | null>;
    findByCne(cne: string): Promise<IStudentDocument | null>;
    findByStudentNumber(student_number: string): Promise<IStudentDocument | null>;
    updateStudentRole(state_student: TStateStudent): Promise<IStudentDocument>;
}

const studentSchema = new Schema<IStudentDocument, IStudentModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    student_cne: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
    },
    student_number: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
    },
    student_state: {
        type: String,
        required: true,
        enum: STATE_STUDENT_ARRAY,
        default: STATE_STUDENT.ON_HOLD,
    },
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

// override the default save method to check if the user_id exist in the database user before saving
studentSchema.pre('save', async function (this: IStudentDocument, next) {
    const user = await this.model(MODEL_NAME.USER).findById(this.user_id);
    if (!user) {
        throw new Error(ERRORS.USER_NOT_FOUND);
    }
    next();
});

studentSchema.statics.findByUserId = async function (user_id: Types.ObjectId) {
    return this.findOne({ user_id });
};

studentSchema.statics.findByCne = async function (cne: string) {
    return this.findOne({ cne });
};

studentSchema.statics.findByStudentNumber = async function (student_number: string) {
    return this.findOne({ student_number });
};

studentSchema.method('updateStudentRole', async function (this: IStudentDocument, state_student: TStateStudent) {
    if (!stateStudentRole.translateState(this.student_state, state_student)) {
        throw new Error(ERRORS.INVALID_STATE_TRANSITION_STUDENT);
    }
    this.student_state = state_student;

    return this.save();
});

studentSchema.index({ user_id: 1 }, { unique: true });

const StudentModel = model<IStudentDocument, IStudentModel>(MODEL_NAME.STUDENT, studentSchema);

export default StudentModel;