import { Types, Schema, model, Model, HydratedDocument } from 'mongoose';
import { MODEL_NAME, STATE_STUDENT_ARRAY, STATE_STUDENT, stateStudentRole } from '@org/shared-ts';
import { ERRORS } from '../constants/MESSAGE';
import { Student } from '../types/Models';


interface StudentStatics {
    findByUserId(user_id: Types.ObjectId): Promise<HydratedStudent | null>;
    findByCne(cne: string): Promise<HydratedStudent | null>;
    findByStudentNumber(student_number: string): Promise<HydratedStudent | null>;
    updateStudentRole(state_student: HydratedStudent): Promise<HydratedStudent>;
}

export type StudentModel = Model<Student> & StudentStatics;
export type HydratedStudent = HydratedDocument<Student>;

const studentSchema = new Schema<Student, StudentModel>({
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
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

// override the default save method to check if the user_id exist in the database user before saving
studentSchema.pre('save', async function (this, next) {
    const user = await this.model(MODEL_NAME.USER).findById(this.user_id);
    if (!user) {
        throw new Error(ERRORS.USER_NOT_FOUND);
    }
    next();
});

studentSchema.statics.findByUserId = async function (user_id) {
    return this.findOne({ user_id });
};

studentSchema.statics.findByCne = async function (cne) {
    return this.findOne({ cne });
};

studentSchema.statics.findByStudentNumber = async function (student_number) {
    return this.findOne({ student_number });
};

studentSchema.method('updateStudentRole', async function (this, state_student) {
    if (!stateStudentRole.translateState(this.student_state, state_student)) {
        throw new Error(ERRORS.INVALID_STATE_TRANSITION_STUDENT);
    }
    this.student_state = state_student;

    return this.save();
});

studentSchema.index({ user_id: 1 }, { unique: true });

const StudentModel = model<Student, StudentModel>(MODEL_NAME.STUDENT, studentSchema);

export default StudentModel;