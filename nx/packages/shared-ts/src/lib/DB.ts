import { z } from "zod";
import { StateController } from "./StateController";

export const STATE_USER_ROLE = {
    ADMIN: "Admin",
    VISITOR: "Visitor",
    STUDENT: "Student",
    DELEGATE_STUDENT: "DelegateStudent",
    PROFESSOR: "Professor",
} as const;

export type TStateUserRole = (typeof STATE_USER_ROLE)[keyof typeof STATE_USER_ROLE];
export const STATE_USER_ROLE_ARRAY = Object.values(STATE_USER_ROLE);

export const stateUserRole = new StateController<TStateUserRole>();
stateUserRole.addState(STATE_USER_ROLE.ADMIN, []);
stateUserRole.addState(STATE_USER_ROLE.VISITOR, [STATE_USER_ROLE.STUDENT]);
stateUserRole.addState(STATE_USER_ROLE.STUDENT, []);
stateUserRole.addState(STATE_USER_ROLE.PROFESSOR, []);


export const GENDER = {
    MAN: "man",
    WOMEN: "women",
} as const;

export type TGender = (typeof GENDER)[keyof typeof GENDER];
export const GENDER_ARRAY = Object.values(GENDER);

export const MODEL_NAME = {
    USER: "Users",
    STUDENT: "Students",
    PROFESSOR: "Professors",
    LOCATION: "Locations",
    DEPARTMENT: "Departments",
    RESET_PASSWORD: "ResetPasswords",
    RESOURCE: "Resources",
    ATTACHMENT: "Attachments",
    MEDIA: "Media",
    POSTULATION: "Postulations",
    POSTULATION_TYPE: "PostulationTypes",
    POSTULATION_TYPE_CONTENT: "PostulationTypeContents",
    TAXONOMY: "Taxonomies",
    UNIVERSITY_PERIOD: "UniversityPeriods",
} as const;

export const zModelName = z.enum(['Users', 'Students', 'Professors', 'Locations', 'Departments', 'ResetPasswords', 'Resources', 'Attachments', 'Media', 'Postulations', 'PostulationTypes', 'PostulationTypeContents', 'Taxonomies', 'UniversityPeriods']);
export type TModelName = (typeof MODEL_NAME)[keyof typeof MODEL_NAME];
export const MODEL_NAME_ARRAY = Object.values(MODEL_NAME);

export const AUTH_PROVIDERS = {
    GOOGLE: "google",
    LINKEDIN: "linkedin",
    CREDENTIAL: "credential",
} as const;

export type TAuthProviders =
    (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
export const AUTH_PROVIDERS_ARRAY = Object.values(AUTH_PROVIDERS);

export const STATE_STUDENT = {
    ON_HOLD: "OnHold",
    ACCEPTED: "Accepted",
    REFUSED: "Refused",
} as const;

export type TStateStudent = (typeof STATE_STUDENT)[keyof typeof STATE_STUDENT];
export const STATE_STUDENT_ARRAY = Object.values(STATE_STUDENT);

export const stateStudentRole = new StateController<TStateStudent>();
stateStudentRole.addState(STATE_STUDENT.ON_HOLD, [STATE_STUDENT.ACCEPTED, STATE_STUDENT.REFUSED]);
stateStudentRole.addState(STATE_STUDENT.ACCEPTED, []);
stateStudentRole.addState(STATE_STUDENT.REFUSED, []);

export const STATE_RESOURCE = {
    ON_HOLD: "OnHold",
    AVAILABLE: "Available",
} as const;

export type TStateResource = (typeof STATE_RESOURCE)[keyof typeof STATE_RESOURCE];
export const STATE_RESOURCE_ARRAY = Object.values(STATE_RESOURCE);

export const stateResourceRole = new StateController<TStateResource>();
stateResourceRole.addState(STATE_RESOURCE.ON_HOLD, [STATE_RESOURCE.AVAILABLE]);
stateResourceRole.addState(STATE_RESOURCE.AVAILABLE, [STATE_RESOURCE.ON_HOLD]);

export const STATE_PROFESSOR = {
    ON_HOLD: "OnHold",
    ACCEPTED: "Accepted",
    REFUSED: "Refused",
} as const;

export type TStateProfessor = (typeof STATE_PROFESSOR)[keyof typeof STATE_PROFESSOR];
export const STATE_PROFESSOR_ARRAY = Object.values(STATE_PROFESSOR);

export const stateProfessorRole = new StateController<TStateProfessor>();
stateProfessorRole.addState(STATE_PROFESSOR.ON_HOLD, [STATE_PROFESSOR.ACCEPTED, STATE_PROFESSOR.REFUSED]);
stateProfessorRole.addState(STATE_PROFESSOR.ACCEPTED, []);
stateProfessorRole.addState(STATE_PROFESSOR.REFUSED, []);

export const STATE_ATTACHMENT = {
    ATTACHED: "Attached",
    UNATTACHED: "Unattached",
} as const;

export type TStateAttachment = (typeof STATE_ATTACHMENT)[keyof typeof STATE_ATTACHMENT];
export const STATE_ATTACHMENT_ARRAY = Object.values(STATE_ATTACHMENT);

export const stateAttachmentRole = new StateController<TStateAttachment>();
stateAttachmentRole.addState(STATE_ATTACHMENT.ATTACHED, [STATE_ATTACHMENT.UNATTACHED]);
stateAttachmentRole.addState(STATE_ATTACHMENT.UNATTACHED, [STATE_ATTACHMENT.ATTACHED]);

export const STATE_POSTULATION = {
    ON_HOLD: "OnHold",
    ACCEPTED: "Accepted",
    REFUSED: "Refused",
} as const;

export type TStatePostulation = (typeof STATE_POSTULATION)[keyof typeof STATE_POSTULATION];
export const STATE_POSTULATION_ARRAY = Object.values(STATE_POSTULATION);

export type ResourceTypes = 'image' | 'video' | 'raw' | 'auto';

const zResourceType = z.enum(['image', 'video', 'raw', 'auto']);
export const zBodyMedia = z.object({
    resource_type: zResourceType.default('auto'),
    user_id: z.string(),
    resource_folder: z.enum(['postulation', 'user', 'department', 'taxonomy', 'university_period', 'resource', 'email']).default('resource'),
});

export const zAttachmentBody = z.object({
    attachment_reference: z.string(),
    attachment_collection: zModelName,
});