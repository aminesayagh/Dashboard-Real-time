import { PaginateModel, Schema, model, Model } from 'mongoose';
import { MODEL_NAME, STATE_RESOURCE_ARRAY, STATE_RESOURCE, STATE_ATTACHMENT_ARRAY, STATE_ATTACHMENT, MODEL_NAME_ARRAY } from 'shared-ts';
import { IAttachmentDocument, IMediaDocument, IResourceDocument } from 'types/Model';

export interface IMediaModel extends Model<IMediaDocument> {};
export interface IAttachmentModel extends Model<IAttachmentDocument> {};

const attachmentSchema = new Schema<IAttachmentDocument, IAttachmentModel>({
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


interface IResourceMethods {
    generateResourceName: (resource_name: string, owner_id: string) => string;
}


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