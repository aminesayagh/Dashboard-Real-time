import { Document, Types } from 'mongoose';

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
    ILocationDocument as ILocationDocumentExtended,
    ILocation,
    IDepartmentDocument as IDepartmentDocumentExtended,
    IDepartment,
    IAttachment,
    IAttachmentDocument as IAttachmentDocumentExtended,
    IUniversityPeriodDocument as IUniversityPeriodDocumentExtended,
    IUniversityPeriod,
    IMediaDocument as IMediaDocumentExtended,
    IMedia,
} from 'shared-ts';

import { 
    IUserMeAggregate as IUserMeAggregateExtended,
    IUserAggregate as IUserAggregateExtended,
} from 'shared-ts';


export type IUserDocument = IUserDocumentExtended<Types.ObjectId, Document<IUser<Types.ObjectId>>>;
export type ITaxonomyDocument = ITaxonomyDocumentExtended<Types.ObjectId, Document<ITaxonomy<Types.ObjectId>>>;
export type IStudentDocument = IStudentDocumentExtended<Types.ObjectId, Document<IStudent<Types.ObjectId>>>;
export type IProfessorDocument = IProfessorDocumentExtended<Types.ObjectId, Document<IProfessor<Types.ObjectId>>>;
export type IResourceDocument = IResourceDocumentExtended<Types.ObjectId, Document<IResource<Types.ObjectId>>>;
export type IMediaDocument = IMediaDocumentExtended<Types.ObjectId, Document<IMedia>>;
export type IPostulationDocument = IPostulationDocumentExtended<Types.ObjectId, Document<IPostulation<Types.ObjectId, Document>>>;
export type IPostulationContentDocument = IPostulationContentDocumentExtended<Types.ObjectId, Document<IPostulationContent<Types.ObjectId>>>;
export type IPostulationTypeContentDocument = IPostulationTypeContentDocumentExtended<Types.ObjectId, Document<IPostulationContent<Types.ObjectId>>>;  // todo: check this
export type ILocationDocument = ILocationDocumentExtended<Types.ObjectId, Document<ILocation<Types.ObjectId>>>;
export type IDepartmentDocument = IDepartmentDocumentExtended<Types.ObjectId, Document<IDepartment<Types.ObjectId>>>;
export type IAttachmentDocument = IAttachmentDocumentExtended<Types.ObjectId, Document<IAttachment<Types.ObjectId>>>;
export type IUniversityPeriodDocument = IUniversityPeriodDocumentExtended<Types.ObjectId, Document<IUniversityPeriod<Types.ObjectId>>>;

export type IUserMeAggregate = IUserMeAggregateExtended<Types.ObjectId, Document<IUser<Types.ObjectId>>>;
export type IUserAggregate = IUserAggregateExtended<Types.ObjectId, Document<IUser<Types.ObjectId>>>;