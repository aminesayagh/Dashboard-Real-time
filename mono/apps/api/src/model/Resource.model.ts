import {
  PaginateModel,
  Schema,
  model,
  Model,
  HydratedDocument,
} from 'mongoose';
import { paginate } from 'mongoose-paginate-v2';

import {
  MODEL_NAME,
  STATE_RESOURCE_ARRAY,
  STATE_RESOURCE,
  STATE_ATTACHMENT_ARRAY,
  STATE_ATTACHMENT,
  MODEL_NAME_ARRAY,
} from '@rtd/shared-ts';
import { Attachment, Media, Resource } from '../types/Models';
import { DocumentNotInit } from '../types/Mongoose';

export type AttachmentModel = Model<Attachment>;
export type HydratedAttachment = HydratedDocument<Attachment>;

const attachmentSchema = new Schema<Attachment, AttachmentModel>(
  {
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
  },
  {
    strict: true,
  },
);

// Resource
export interface ResourceMethods {
  assignMedia: (media: DocumentNotInit<Media>) => Promise<Resource>;
  assignAttachment: (
    attachment: DocumentNotInit<Attachment>,
  ) => Promise<Resource>;
  findAttachmentById: (attachment_id: string) => HydratedAttachment | undefined;
}

interface ResourceStatics {
  generateResourceName: (resource_name: string, owner_id: string) => string;
}

export type ResourceModel = PaginateModel<Resource, unknown, ResourceMethods> &
  Model<Resource, unknown, ResourceMethods> &
  ResourceStatics;
export type HydratedResource = HydratedDocument<Resource>;

export type MediaModel = Model<Media>;
export type HydratedMedia = HydratedDocument<Media>;

const mediaSchema = new Schema<Media, MediaModel>(
  {
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
  },
  {
    strict: true,
  },
);

const resourceSchema = new Schema<Resource, ResourceModel, ResourceMethods>(
  {
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
  },
  {
    strict: true,
  },
);

// add a static method to the schema to generate name of an resource
resourceSchema.static(
  'generateResourceName',
  (resource_name: string, owner_id: string) => {
    return `${resource_name}-${owner_id}`;
  },
);

// add a new method to resourceSchema.methods, helping to assign a new resource_media
resourceSchema.methods.assignMedia = function (media) {
  const mediaDoc = new MediaModel(media);
  this.resource_media.push(mediaDoc);
  return this.save();
};

// add a attachment to resource
resourceSchema.methods.assignAttachment = function (attachment) {
  const attachmentDoc = new AttachmentModel(attachment);
  this.resource_attachments.push(attachmentDoc);
  return this.save();
};

// add a method to Find a attachment by id and return HydratedAttachment
resourceSchema.methods.findAttachmentById = function (attachment_id: string) {
  const attachment = this.resource_attachments.find(
    (attachment) =>
      attachment._id && attachment._id.toString() === attachment_id,
  );
  return attachment as HydratedAttachment;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
mediaSchema.plugin(paginate as any);

const AttachmentModel = model<Attachment, AttachmentModel>(
  MODEL_NAME.ATTACHMENT,
  attachmentSchema,
  MODEL_NAME.ATTACHMENT.toLowerCase(),
);
const MediaModel = model<Media, MediaModel>(
  MODEL_NAME.MEDIA,
  mediaSchema,
  MODEL_NAME.MEDIA.toLowerCase(),
);
const ResourceModel = model<Resource, ResourceModel>(
  MODEL_NAME.RESOURCE,
  resourceSchema,
  MODEL_NAME.RESOURCE.toLowerCase(),
);

export default ResourceModel;
