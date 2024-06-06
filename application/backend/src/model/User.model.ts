import { PaginateModel } from 'mongoose';
import { Schema, model, Types } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import { STATE_USER_ROLE, MODEL_NAME, GENDER_ARRAY, AUTH_PROVIDERS_ARRAY, TGender, TAuthProviders, TStateUserRole, stateUserRole, AUTH_PROVIDERS } from 'constants/DB';
import { ERRORS } from 'constants/ERRORS';
import { DefaultDocument } from 'types/Mongoose';
import { hashPassword, comparePassword } from 'helper/hash';

interface IUser {
    first_name?: string;
    last_name?: string;
    email: string;
    password?: string;
    statusUserRole: string[];
    img?: Types.ObjectId;
    gender: TGender;
    cin?: string;
    phone?: string;
    address?: string;
    email_verified?: boolean;
    auth_provider: TAuthProviders,
    last_password_reset?: {
        date: Date,
        password: string
    }[]
}

export interface IUserDocument extends DefaultDocument<IUser> {
    addUserRole(role: TStateUserRole): Promise<IUserDocument>;
    removeUserRole(role: TStateUserRole): Promise<IUserDocument>;
    resetPassword(password: string): Promise<IUserDocument>;
    addLastPasswordReset(password: string): Promise<IUserDocument>;
    verifyPasswordExist(password: string): Promise<boolean>;
    verifyPassword(password: string): Promise<boolean>;
    findByEmail(email: string): Promise<IUserDocument | null>;
}
export interface IUserModel extends PaginateModel<IUserDocument> {}


const userSchema = new Schema<IUserDocument, IUserModel>({
    first_name: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    last_name: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength: 6,
        maxlength: 50
    },
    statusUserRole: {
        type: [String],
        required: true,
        trim: true,
        default: [STATE_USER_ROLE.VISITOR]
    },
    img: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: MODEL_NAME.RESOURCE
    },
    gender: {
        type: String,
        required: false,
        trim: true,
        enum: GENDER_ARRAY
    },
    cin: {
        type: String,
        required: false,
        trim: true,
        minlength: 8,
        maxlength: 8
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    address: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email_verified: {
        type: Boolean,
        required: false,
        default: false
    },
    auth_provider: {
        type: String,
        required: true,
        enum: AUTH_PROVIDERS_ARRAY,
    },
    last_password_reset: [{
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            maxlength: 50
        }
    }]
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

userSchema.pre(['find', 'findOne'], function () {
    const query = this.getQuery();
    if (query.password) {
        delete query.password;
        delete query.last_password_reset;
    }
});

userSchema.method('addUserRole', async function (role: TStateUserRole) {
    const actualUserRole = this.statusUserRole as TStateUserRole[];
    if (actualUserRole.includes(role)) {
        return this;
    }

    for (const actualRole of actualUserRole) {
        if (stateUserRole.translateState(actualRole, role)) {
            // TODO: if new role is student, we need to check if the user is already has the student document
            // TODO: if new role is professor, we need to check if the user is already has the professor document
            this.statusUserRole.push(role);
        }
    }
    return this.save();
});

userSchema.method('removeUserRole', async function (this: IUserDocument, role: TStateUserRole) {
    const actualUserRole = this.statusUserRole as TStateUserRole[];
    if (!actualUserRole.includes(role)) {
        return this;
    }
    this.statusUserRole = actualUserRole.filter((actualRole) => actualRole !== role);
    return this.save();
});

userSchema.method('verifyPasswordExist', async function (this: IUserDocument, password: string): Promise<boolean> {
    if (this.auth_provider !== AUTH_PROVIDERS.CREDENTIAL || !this.password) {
        throw new Error(ERRORS.BAD_CREDENTIALS);
    }
    const lastPasswordReset = this.last_password_reset;
    if (!lastPasswordReset) {
        throw new Error(ERRORS.DON_T_HAVE_PASSWORD);
    }
    for (const { password: lastPassword } of lastPasswordReset) {
        const validPassword = await comparePassword(password, lastPassword);
        if (validPassword) {
            return true;
        }
    }
    return false;
});

userSchema.method('resetPassword', async function (this: IUserDocument, password: string) {
    const validated = await this.verifyPasswordExist(password);
    if (validated) {
        throw new Error(ERRORS.PASSWORD_ALREADY_USED);
    }
    const newPassword = await hashPassword(password);
    if (!this.last_password_reset) {
        this.last_password_reset = [];
    }
    this.last_password_reset.push({
        date: new Date(),
        password: newPassword,
    });
    this.password = newPassword;
    return this.save();
});

userSchema.method('verifyPassword', async function (this: IUserDocument, password: string) {
    if (this.auth_provider !== AUTH_PROVIDERS.CREDENTIAL || !this.password) {
        throw new Error(ERRORS.BAD_CREDENTIALS);
    }
    return comparePassword(password, this.password);
});

userSchema.method('findByEmail', async function (this: IUserModel, email: string) {
    return this.findOne({ email });
});


userSchema.plugin(mongoosePagination as any);

const UserModel = model<IUserDocument, IUserModel>(MODEL_NAME.USER, userSchema, MODEL_NAME.USER.toLowerCase());

UserModel.paginate().then();

export default UserModel;