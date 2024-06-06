import { PaginateModel } from 'mongoose';
import { Schema, model, Types } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import { STATE_USER_ROLE, MODEL_NAME, GENDER_ARRAY, AUTH_PROVIDERS_ARRAY, TGender, TAuthProviders, TStateUserRole, stateUserRole, AUTH_PROVIDERS } from 'constants/DB';
import { ERRORS } from 'constants/ERRORS';
import { DefaultDocument } from 'types/Mongoose';
import { hashPassword, comparePassword } from 'helper/hash';

interface IUser {
    user_first_name?: string;
    user_last_name?: string;
    user_email: string;
    user_password?: string;
    user_roles: TStateUserRole[];
    user_avatar?: Types.ObjectId;
    user_gender: TGender;
    user_cin?: string;
    user_phone?: string;
    user_address?: string;
    user_address_secondary?: string;
    user_email_verified?: boolean;
    user_auth_provider: TAuthProviders,
    user_reset_passwords?: {
        user_password: string
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

const PasswordSchema = new Schema({
    user_password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 50
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
    }
});

const userSchema = new Schema<IUserDocument, IUserModel>({
    user_first_name: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    user_last_name: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    user_email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    user_password: {
        type: String,
        required: false,
        trim: true,
        minlength: 6,
        maxlength: 50
    },
    user_roles: {
        type: [String],
        required: true,
        trim: true,
        default: [STATE_USER_ROLE.VISITOR]
    },
    user_avatar: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: MODEL_NAME.RESOURCE
    },
    user_gender: {
        type: String,
        required: false,
        trim: true,
        enum: GENDER_ARRAY
    },
    user_cin: {
        type: String,
        required: false,
        trim: true,
        minlength: 8,
        maxlength: 8
    },
    user_phone: {
        type: String,
        required: false,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    user_address: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    user_address_secondary: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    user_email_verified: {
        type: Boolean,
        required: false,
        default: false
    },
    user_auth_provider: {
        type: String,
        required: true,
        enum: AUTH_PROVIDERS_ARRAY,
    },
    user_reset_passwords: [PasswordSchema],
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
        delete query.reset_passwords;
    }
});

userSchema.method('addUserRole', async function (role: TStateUserRole) {
    const actualUserRole = this.user_roles as TStateUserRole[];
    if (actualUserRole.includes(role)) {
        return this;
    }

    for (const actualRole of actualUserRole) {
        if (stateUserRole.translateState(actualRole, role)) {
            // TODO: if new role is student, we need to check if the user is already has the student document
            // TODO: if new role is professor, we need to check if the user is already has the professor document
            this.user_roles.push(role);
        }
    }
    return this.save();
});

userSchema.method('removeUserRole', async function (this: IUserDocument, role: TStateUserRole) {
    const actualUserRole = this.user_roles as TStateUserRole[];
    if (!actualUserRole.includes(role)) {
        return this;
    }
    this.user_roles = actualUserRole.filter((actualRole) => actualRole !== role);
    return this.save();
});

userSchema.method('verifyPasswordExist', async function (this: IUserDocument, password: string): Promise<boolean> {
    if (this.user_auth_provider !== AUTH_PROVIDERS.CREDENTIAL || !this.user_password) {
        throw new Error(ERRORS.BAD_CREDENTIALS);
    }
    const lastPasswordReset = this.user_reset_passwords;
    if (!lastPasswordReset) {
        throw new Error(ERRORS.DON_T_HAVE_PASSWORD);
    }
    for (const { user_password: lastPassword } of lastPasswordReset) {
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
    if (!this.user_reset_passwords) {
        this.user_reset_passwords = [];
    }
    const newPasswordDocument = {
        user_password: newPassword
    };
    this.user_reset_passwords.push(newPasswordDocument);
    this.user_password = newPassword;
    return this.save();
});

userSchema.method('verifyPassword', async function (this: IUserDocument, password: string) {
    if (this.user_auth_provider !== AUTH_PROVIDERS.CREDENTIAL || !this.user_password) {
        throw new Error(ERRORS.BAD_CREDENTIALS);
    }
    return comparePassword(password, this.user_password);
});

userSchema.method('findByEmail', async function (this: IUserModel, email: string) {
    return this.findOne({ email });
});


userSchema.plugin(mongoosePagination as any);

const UserModel = model<IUserDocument, IUserModel>(MODEL_NAME.USER, userSchema, MODEL_NAME.USER.toLowerCase());

UserModel.paginate().then();

export default UserModel;