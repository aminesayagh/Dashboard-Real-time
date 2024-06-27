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
import { Types, Document as MongoDocument, HydratedDocument } from 'mongoose';

type Document<T> = HydratedDocument<T>;

export type User = TUser<Types.ObjectId>;
export type UniversityPeriod = TUniversityPeriod<Types.ObjectId>;
export type Taxonomy = TTaxonomy<Types.ObjectId>;
export type Student = TStudent<Types.ObjectId>; 
export type Media = TMedia;
export type Attachment = TAttachment<Types.ObjectId>;
export type Resource = TResource<Types.ObjectId, Document<Attachment>, Document<Media>>;
export type Professor = TProfessor<Types.ObjectId>;
export type PostulationTypeContent = TPostulationTypeContent;
export type PostulationType = TPostulationType<Types.ObjectId>;
export type PostulationContent = TPostulationContent<Types.ObjectId>;
export type Postulation = TPostulation<Types.ObjectId>;
export type Department = TDepartment<Types.ObjectId>;
export type Location = TLocation<Types.ObjectId>;
export type UserMeAggregate = TUserMeAggregate<Types.ObjectId>;
export type UserAggregate = TUserAggregate<Types.ObjectId>;
