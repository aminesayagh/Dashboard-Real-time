import {
  PaginateModel,
  Schema,
  model,
  Types,
  HydratedDocument,
  Model,
  InferRawDocType,
} from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import {
  STATE_USER_ROLE,
  MODEL_NAME,
  GENDER_ARRAY,
  TStateUserRole,
  stateUserRole,
} from '@rtd/shared-ts';

import { UserMeAggregate, UserAggregate, User } from '../types/Models';

export interface UserMethods {
  addUserRole(role: TStateUserRole): Promise<HydratedUser>;
  removeUserRole(role: TStateUserRole): Promise<HydratedUser>;
}

interface UserStatics {
  profile(id: string): Promise<UserAggregate>;
  findByEmail(email: string): Promise<HydratedUser | null>;
  me(id: Types.ObjectId): Promise<UserMeAggregate>;
}

// export interface IUserDocument extends IUserDocumentExtended {}
export type UserModel = PaginateModel<User> &
  Model<User, unknown, UserMethods> &
  UserStatics;
export type HydratedUser = HydratedDocument<User, UserMethods>;

const schemaDefinition = {
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
    maxlength: 20,
  },
  name: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  user_roles: [
    {
      type: String,
      required: true,
      default: [STATE_USER_ROLE.VISITOR],
      enum: Object.values(STATE_USER_ROLE),
    },
  ],
  user_avatar: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAME.RESOURCE,
  },
  user_gender: {
    type: String,
    required: false,
    trim: true,
    enum: GENDER_ARRAY,
  },
  user_cin: {
    type: String,
    required: false,
    trim: true,
    minlength: 8,
    maxlength: 8,
  },
  user_phone: {
    type: String,
    required: false,
    trim: true,
    minlength: 10,
    maxlength: 10,
  },
  user_address: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  user_address_secondary: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
} as const;

export type UserObject = InferRawDocType<typeof userSchema>;

const userSchema = new Schema<User, UserModel, UserMethods>(schemaDefinition, {
  strict: true,
});

userSchema.methods.addUserRole = async function (role: TStateUserRole) {
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
};

userSchema.methods.removeUserRole = async function (this, role) {
  const actualUserRole = this.user_roles as TStateUserRole[];
  if (!actualUserRole.includes(role)) {
    return this;
  }
  this.user_roles = actualUserRole.filter((actualRole) => actualRole !== role);
  return this.save();
};

userSchema.statics['findByEmail'] = async function (this, email) {
  return await this.findOne({ email }).exec();
};

userSchema.statics['me'] = async function (this, id) {
  const _id = new Types.ObjectId(id);
  const userAggregate = await this.aggregate<UserMeAggregate>([
    { $match: { _id } },
    {
      $lookup: {
        from: MODEL_NAME.STUDENT,
        localField: '_id', // user_id
        foreignField: 'user_id', // student_id
        as: 'student_doc', // student_doc
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.PROFESSOR,
        localField: '_id', // user_id
        foreignField: 'user_id', // professor_id
        as: 'professor_doc', // professor_doc
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.DEPARTMENT,
        localField: '_id', // user_id
        foreignField: 'department_manager', // department_manager
        as: 'department_managed_doc', // department_managed_doc
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.TAXONOMY,
        localField: '_id', // user_id
        foreignField: 'taxonomy_manager', // taxonomy_manager
        as: 'taxonomies_managed_doc', // taxonomies_managed_doc
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.POSTULATION,
        localField: '_id', // user_id
        foreignField: 'user_id', // user_id
        as: 'postulation_docs', // postulation_docs
      },
    },
    {
      $project: {
        _id: 1,
        updated_at: 1,
        created_at: 1,
        user_avatar: 1,
        user_first_name: 1,
        user_last_name: 1,
        user_email: 1,
        user_roles: 1,
        user_gender: 1,
        user_cin: 1,
        user_phone: 1,
        user_address: 1,
        user_address_secondary: 1,
        user_email_verified: 1,
        user_auth_provider: 1,
        student_doc: { $arrayElemAt: ['$student_doc', 0] },
        professor_doc: { $arrayElemAt: ['$professor_doc', 0] },
        department_managed_doc: {
          $arrayElemAt: ['$department_managed_doc', 0],
        },
        taxonomies_managed_doc: 1,
        postulation_docs: 1,
      },
    },
  ]);

  return userAggregate[0];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.plugin(paginate as any);

const UserModel = model<User, UserModel>(
  MODEL_NAME.USER,
  userSchema,
  MODEL_NAME.USER.toLowerCase(),
);

export default UserModel;
