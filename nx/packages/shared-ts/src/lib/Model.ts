import { TStateUserRole, TGender, TStatePostulation, TStateStudent, TModelName, TStateAttachment, TStateResource, TStateProfessor,  } from "./DB";
import { DefaultDocument } from "./mongodb";

export interface IUser<ObjectId> {
  user_first_name?: string;
  user_last_name?: string;
  email: string;
  name: string;
  user_roles: TStateUserRole[];
  user_avatar?: ObjectId;
  user_gender: TGender;
  user_cin?: string;
  user_phone?: string;
  user_address?: string;
  user_address_secondary?: string;
  emailVerified: Date;
  image: string;
}


export interface IUniversityPeriod<ObjectId> {
  period_name: string;
  period_date_start: Date;
  period_date_end: Date;
  period_state: TStatePostulation;
  period_next?: ObjectId;
  period_previous?: ObjectId;
}

export interface ITaxonomy<ObjectId> {
    taxonomy_type: string;
    taxonomy_value: string;
    taxonomy_parent_id?: ObjectId;
    taxonomy_level: number;
    taxonomy_responsible_id: ObjectId;
    taxonomy_state: string;
}


export interface IStudent<ObjectId> {
  user_id: ObjectId;
  student_cne: string;
  student_number: string;
  student_state: TStateStudent;
}

export interface IMedia {
  media_source: string;
  media_public_id: string;
  media_signature: string;
  media_url: string;
}

export interface IAttachment<ObjectId> {
  attachment_reference: ObjectId;
  attachment_collection: TModelName;
  attachment_state: TStateAttachment;
}



export interface IResource<ObjectId> {
  resource_name: string;
  resource_media: IMedia[]
  resource_owner: ObjectId;
  resource_type: string;
  resource_state: TStateResource;
  resource_attachments: DefaultDocument<IAttachment<ObjectId>, ObjectId, Document>[];
}


export interface IProfessor<ObjectId> {
  user_id: ObjectId;
  professor_office_location: string;
  professor_state: TStateProfessor;
}



export interface IPostulationTypeContent {
  postulation_type_content_name: string;
  postulation_type_content_description: string;
  postulation_type_content_type: TModelName;
  postulation_type_content_required: boolean;
  postulation_type_content_options?: string[]; // for select type
}

export interface IPostulationType<ObjectId> {
  taxonomies_id: ObjectId[];
  department_id: ObjectId;
  postulation_type_period: ObjectId[];
  postulation_type_name: string;
  postulation_type_content: ObjectId[];
}

export interface IPostulationContent<ObjectId> {
  postulation_content_body: ObjectId;
  postulation_content_type: ObjectId;
}



export interface IPostulation<ObjectId, Document> {
  resources_id?: ObjectId[];
  user_id: ObjectId;
  postulation_department_id: ObjectId;
  postulation_state: TStatePostulation;
  postulation_type: ObjectId;
  postulation_content: DefaultDocument<IPostulationContent<ObjectId> ,ObjectId, Document>[];
}


export interface IDepartment<ObjectId> {
  department_name: string;
  responsible_id: ObjectId;
}


export interface ILocation<ObjectId> {
  location_name: string;
  location_reference: string;
  department_id: ObjectId;
}

export type IUserDocument<ObjectId, Document> = DefaultDocument<IUser<ObjectId>, ObjectId, Document>;
export type ITaxonomyDocument<ObjectId, Document> = DefaultDocument<ITaxonomy<ObjectId>, ObjectId, Document>;
export type IStudentDocument<ObjectId, Document> = DefaultDocument<IStudent<ObjectId>, ObjectId, Document>;
export type IMediaDocument<ObjectId, Document> = DefaultDocument<IMedia, ObjectId, Document>;
export type IResourceDocument<ObjectId, Document> = DefaultDocument<IResource<ObjectId>, ObjectId, Document>;
export type IAttachmentDocument<ObjectId, Document> = DefaultDocument<IAttachment<ObjectId>, ObjectId, Document>;
export type IProfessorDocument<ObjectId, Document> = DefaultDocument<IProfessor<ObjectId>, ObjectId, Document>;
export type ILocationDocument<ObjectId, Document> = DefaultDocument<ILocation<ObjectId>, ObjectId, Document>;
export type IDepartmentDocument<ObjectId, Document> = DefaultDocument<IDepartment<ObjectId>, ObjectId, Document>;
export type IPostulationDocument<ObjectId, Document> = DefaultDocument<IPostulation<ObjectId, Document>, ObjectId, Document>;
export type IPostulationContentDocument<ObjectId, Document> = DefaultDocument<IPostulationContent<ObjectId>, ObjectId, Document>;
export type IPostulationTypeDocument<ObjectId, Document> = DefaultDocument<IPostulationType<ObjectId>, ObjectId, Document>;
export type IPostulationTypeContentDocument<ObjectId, Document> = DefaultDocument<IPostulationTypeContent, ObjectId, Document>;
export type IUniversityPeriodDocument<ObjectId, Document> = DefaultDocument<IUniversityPeriod<ObjectId>, ObjectId, Document>;