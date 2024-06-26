import { Document as DocumentMongo, Types } from 'mongoose';

import {
    IUserDocument as IUserDocumentExtended,
    IUser,
    ITaxonomyDocument as ITaxonomyDocumentExtended,
    ITaxonomy,
    IStudentDocument as IStudentDocumentExtended,
    IStudent,
    IProfessorDocument as IProfessorDocumentExtended,
    IProfessor,
    IResourceDocument as IResourceDocumentExtended,
    IResource,
    IPostulationDocument as IPostulationDocumentExtended,
    IPostulation,
    IPostulationContentDocument as IPostulationContentDocumentExtended,
    IPostulationContent,
    IPostulationTypeContentDocument as IPostulationTypeContentDocumentExtended,
    IPostulationTypeContent,
    ILocationDocument as ILocationDocumentExtended,
    ILocation,
    IDepartmentDocument as IDepartmentDocumentExtended,
    IDepartment,
    IAttachment,
    IAttachmentDocument as IAttachmentDocumentExtended,
    AttachmentObject as IAttachmentObject,
    IUniversityPeriodDocument as IUniversityPeriodDocumentExtended,
    IUniversityPeriod,
    IMediaDocument as IMediaDocumentExtended,
    IMedia,
    IPostulationTypeDocument as IPostulationTypeDocumentExtended,
    IPostulationType,
} from 'shared-ts';

import { 
    IUserMeAggregate as IUserMeAggregateExtended,
    IUserAggregate as IUserAggregateExtended,
} from 'shared-ts';

type Document<T = any> = DocumentMongo<Types.ObjectId, any, T>; 

export type User = IUser<Types.ObjectId>;
export type Taxonomy = ITaxonomy<Types.ObjectId>;
export type Student = IStudent<Types.ObjectId>;
export type Professor = IProfessor<Types.ObjectId>;
export type Resource = IResource<Types.ObjectId>;
export type Postulation = IPostulation<Types.ObjectId, Document>;
export type PostulationContent = IPostulationContent<Types.ObjectId>;
export type PostulationTypeContent = IPostulationTypeContent;
export type PostulationType = IPostulationType<Types.ObjectId>;
export type Location = ILocation<Types.ObjectId>;
export type Department = IDepartment<Types.ObjectId>;
export type Attachment<O = Types.ObjectId> = IAttachment<O>;
export type UniversityPeriod = IUniversityPeriod<Types.ObjectId>;
export type Media = IMedia;

export type IUserDocument = IUserDocumentExtended<Types.ObjectId, Document<User>>;

export type ITaxonomyDocument = ITaxonomyDocumentExtended<Types.ObjectId, Document<Taxonomy>>;

export type IStudentDocument = IStudentDocumentExtended<Types.ObjectId, Document<Student>>;

export type IProfessorDocument = IProfessorDocumentExtended<Types.ObjectId, Document<Professor>>;

export type IResourceDocument = IResourceDocumentExtended<Types.ObjectId, Document<Resource>>;
export type IMediaDocument = IMediaDocumentExtended<Types.ObjectId, Document<Media>>;
export type IAttachmentDocument = IAttachmentDocumentExtended<Types.ObjectId, Document<Attachment>>;
export type AttachmentObject = IAttachmentObject<Types.ObjectId>;


export type IPostulationDocument = IPostulationDocumentExtended<Types.ObjectId, Document<Postulation>>;
export type IPostulationContentDocument = IPostulationContentDocumentExtended<Types.ObjectId, Document<PostulationContent>>;

export type IPostulationTypeContentDocument = IPostulationTypeContentDocumentExtended<Types.ObjectId, Document<PostulationTypeContent>>;  // todo: check this
export type IPostulationTypeDocument = IPostulationTypeDocumentExtended<Types.ObjectId, Document<PostulationType>>;

export type ILocationDocument = ILocationDocumentExtended<Types.ObjectId, Document<Location>>;
export type IDepartmentDocument = IDepartmentDocumentExtended<Types.ObjectId, Document<Department>>;

export type IUniversityPeriodDocument = IUniversityPeriodDocumentExtended<Types.ObjectId, Document<UniversityPeriod>>;

export type IUserMeAggregate = IUserMeAggregateExtended<Types.ObjectId, Document<User>>;
export type IUserAggregate = IUserAggregateExtended<Types.ObjectId, Document<User>>;

