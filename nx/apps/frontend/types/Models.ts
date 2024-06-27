import {
    User as TUser,
    UniversityPeriod as TUniversityPeriod,
    Taxonomy as TTaxonomy,
    Student as TStudent,
    Media as TMedia,
    Attachment as TAttachment,
    Resource as TResource,
    Professor as TProfessor,
    PostulationTypeContent as TPostulationTypeContent,
    PostulationType as TPostulationType,
    PostulationContent as TPostulationContent,
    Postulation as TPostulation,
    Department as TDepartment,
    Location as TLocation,
    UserMeAggregate as TUserMeAggregate,
    UserAggregate as TUserAggregate,
} from 'shared-ts';

export type Document<T> = {
    _id: string;
    doc: T;
    createdAt: Date;
    updatedAt: Date;
}

export type User = Document<TUser>;
export type UniversityPeriod = Document<TUniversityPeriod>;
export type Taxonomy = Document<TTaxonomy>;
export type Student = Document<TStudent>; 
export type Media = Document<TMedia>;
export type Attachment = Document<TAttachment>;
export type Resource = Document<TResource<string, Document<Attachment>, Document<Media>>>;
export type Professor = Document<TProfessor>;
export type PostulationTypeContent = Document<TPostulationTypeContent>;
export type PostulationType = Document<TPostulationType>;
export type PostulationContent = Document<TPostulationContent>;
export type Postulation = Document<TPostulation>;
export type Department = Document<TDepartment>;
export type Location = Document<TLocation>;

export type UserMeAggregate = Document<TUserMeAggregate>;
export type UserAggregate = Document<TUserAggregate>;