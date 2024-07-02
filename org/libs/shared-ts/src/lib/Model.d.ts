import { TStateUserRole, TGender, TStatePostulation, TStateStudent, TModelName, TStateAttachment, TStateResource, TStateProfessor,  } from "./DB";

export interface DocumentBase<ObjectId> {
    _id: ObjectId;
    updatedAt: number;
    createdAt: number;
}

export interface User<ObjectId = string> extends DocumentBase<ObjectId> {
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


export interface UniversityPeriod<ObjectId = string> extends DocumentBase<ObjectId>
 {
  period_name: string;
  period_date_start: Date;
  period_date_end: Date;
  period_state: TStatePostulation;
  period_next?: ObjectId;
  period_previous?: ObjectId;
}
export interface Taxonomy<ObjectId = string> extends DocumentBase<ObjectId> {
  taxonomy_type: string;
  taxonomy_value: string;
  taxonomy_parent_id?: ObjectId;
  taxonomy_level: number;
  taxonomy_responsible_id: ObjectId;
  taxonomy_state: string;
}

export interface Student<ObjectId = string> extends DocumentBase<ObjectId> {
  user_id: ObjectId;
  student_cne: string;
  student_number: string;
  student_state: TStateStudent;
}

export interface Media extends DocumentBase<string> {
  media_source: string;
  media_public_id: string;
  media_signature: string;
  media_url: string;
}

export interface Attachment<ObjectId = string> extends DocumentBase<ObjectId> {
  attachment_reference: ObjectId;
  attachment_collection: TModelName;
  attachment_state: TStateAttachment;
}

export interface Resource<ObjectId = string, AttachmentDocument = Attachment & {
  _id: ObjectId;
}, MediaDocument = Media & {
  _id: ObjectId;
}> extends DocumentBase<ObjectId> {
  resource_name: string;
  resource_media: MediaDocument[]
  resource_owner: ObjectId;
  resource_type: string;
  resource_state: TStateResource;
  resource_attachments: AttachmentDocument[];
}

export interface Professor<ObjectId = string> extends DocumentBase<ObjectId> {
  user_id: ObjectId;
  professor_office_location: string;
  professor_state: TStateProfessor;
}

export interface PostulationTypeContent<ObjectId = string> extends DocumentBase<ObjectId> {
  postulation_type_content_name: string;
  postulation_type_content_description: string;
  postulation_type_content_type: TModelName;
  postulation_type_content_required: boolean;
  postulation_type_content_options?: string[]; // for select type
}

export interface PostulationType<ObjectId = string> extends DocumentBase<ObjectId> {
  taxonomies_id: ObjectId[];
  department_id: ObjectId;
  postulation_type_period: ObjectId[];
  postulation_type_name: string;
  postulation_type_content: ObjectId[];
}

export interface PostulationContent<ObjectId = string> extends DocumentBase<ObjectId> {
  postulation_content_body: ObjectId;
  postulation_content_type: ObjectId;
}

export interface Postulation<ObjectId = string> extends DocumentBase<ObjectId> {
  resources_id?: ObjectId[];
  user_id: ObjectId;
  postulation_department_id: ObjectId;
  postulation_state: TStatePostulation;
  postulation_type: ObjectId;
  postulation_content: PostulationContent<ObjectId>[];
}

export interface Department<ObjectId = string> extends DocumentBase<ObjectId> {
  department_name: string;
  responsible_id: ObjectId;
}

export interface Location<ObjectId = string> extends DocumentBase<ObjectId> {
  location_name: string;
  location_reference: string;
  department_id: ObjectId;
}

export interface UserMeAggregate<ObjectId = string> extends DocumentBase<ObjectId>, Omit<User<ObjectId>, 'user_avatar'> {
  user_avatar: Resource<ObjectId>;
  student_doc?: Student<ObjectId>;
  professor_doc?: Professor<ObjectId>;
  department_managed_doc?: Department<ObjectId>;
  taxonomies_managed_doc?: Taxonomy<ObjectId>[];
  postulation_docs?: Postulation<ObjectId>[];
}

export interface UserAggregate<ObjectId = string> extends DocumentBase<ObjectId>, Omit<User<ObjectId>, 'user_avatar'> {
  student : Student<ObjectId>;
  professor : Professor<ObjectId>;
}
