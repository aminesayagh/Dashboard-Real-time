import { Types, PaginateModel, Schema, model, Model } from 'mongoose';
import { MODEL_NAME, STATE_RESOURCE_ARRAY, STATE_RESOURCE, TStateResource, TStateAttachment, STATE_ATTACHMENT_ARRAY, STATE_ATTACHMENT, TModelName, MODEL_NAME_ARRAY } from '../constants/DB';
import { DefaultDocument } from 'types/Mongoose';

interface IMedia {
    media_source: string;
    media_public_id: string;
    media_signature: string;
    media_url: string;
}



export interface IMediaDocument extends DefaultDocument<IMedia> {};

export interface IMediaModel extends Model<IMediaDocument> {};

interface IAttachment {
    attachment_reference: Types.ObjectId;
    attachment_collection: TModelName;
    attachment_state: TStateAttachment;
}

export interface IAttachmentDocument extends DefaultDocument<IAttachment> {};

export interface IAttachmentModel extends Model<IAttachmentDocument> {};

const attachmentSchema = new Schema<IAttachment, IAttachmentModel>({
    attachment_reference: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    attachment_collection: {
        type: String,
        enum: MODEL_NAME_ARRAY,
        required: true,
    },
    attachment_state: {
        type: String,
        required: true,
        enum: STATE_ATTACHMENT_ARRAY,
        default: STATE_ATTACHMENT.ATTACHED,
    },
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

interface IResource {
    resource_name: string;
    resource_media: IMediaDocument[]
    resource_owner: Types.ObjectId;
    resource_type: string;
    resource_state: TStateResource;
    resource_attachments: IAttachmentDocument[];
}

interface IResourceMethods {
    generateResourceName: (resource_name: string, owner_id: string) => string;
}

export interface IResourceDocument extends DefaultDocument<IResource>, IResourceMethods {};

export interface IResourceModel extends PaginateModel<IResourceDocument>, IResourceMethods {};

const mediaSchema = new Schema<IMediaDocument, IMediaModel>({
    media_source: {
        type: String,
        required: true,
        trim: true,
    },
    media_public_id: {
        type: String,
        required: true,
        trim: true,
    },
    media_signature: {
        type: String,
        required: true,
        trim: true,
    },
    media_url: {
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
    resource_name: {
        type: String,
        required: true,
        readOnly: true,
        trim: true,
        unique: true,
    },
    resource_media: [mediaSchema],
    resource_owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODEL_NAME.USER,
    },
    resource_type: {
        type: String,
        required: true,
        trim: true,
    },
    resource_state: {
        type: String,
        required: true,
        enum: STATE_RESOURCE_ARRAY,
        default: STATE_RESOURCE.AVAILABLE,
    },
    resource_attachments: [attachmentSchema],
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

// add a static method to the schema to generate name of an resource
resourceSchema.static('generateResourceName', (resource_name: string, owner_id: string) => {
    return `${resource_name}-${owner_id}`;
});

const ResourceModel = model<IResourceDocument, IResourceModel>(MODEL_NAME.RESOURCE, resourceSchema, MODEL_NAME.RESOURCE.toLowerCase());

export default ResourceModel;