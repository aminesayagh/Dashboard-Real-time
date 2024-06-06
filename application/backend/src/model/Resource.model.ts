import { Types, PaginateModel, Schema, model, Model } from 'mongoose';
import { MODEL_NAME, STATE_RESOURCE_ARRAY, STATE_RESOURCE, TStateResource } from 'constants/DB';
import { DefaultDocument } from 'types/Mongoose';

interface IMedia {
    source: string;
    public_id: string;
    signature: string;
    url: string;
}

interface IMediaDocument extends DefaultDocument<IMedia> {};

export interface IMediaModel extends Model<IMediaDocument> {};

interface IResource {
    name: string;
    media: []
    owner: Types.ObjectId;
    type: string;
    state_resource: TStateResource;
    number_of_use: number; 
}

export interface IResourceDocument extends DefaultDocument<IResource> {};

export interface IResourceModel extends PaginateModel<IResourceDocument> {};

const mediaSchema = new Schema<IMediaDocument, IMediaModel>({
    source: {
        type: String,
        required: true,
        trim: true,
    },
    public_id: {
        type: String,
        required: true,
        trim: true,
    },
    signature: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

const resourceSchema = new Schema<IResourceDocument, IResourceModel>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    media: [mediaSchema],
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    state_resource: {
        type: String,
        required: true,
        enum: STATE_RESOURCE_ARRAY,
        default: STATE_RESOURCE.AVAILABLE,
    },
    number_of_use: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

const ResourceModel = model<IResourceDocument, IResourceModel>(MODEL_NAME.RESOURCE, resourceSchema, MODEL_NAME.RESOURCE.toLowerCase());

export default ResourceModel;