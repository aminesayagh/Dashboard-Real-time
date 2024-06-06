import { StateController } from "helper/StateController";

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
    SEMESTER: "Semesters",
    PROFESSOR: "Professors",
    OPTION: "Options",
    RESOURCE: "Resources",
    POSTULATION: "Postulations",
    SECTOR: "Sectors",
    CONFIG: "Configs",
    CONFIG_HISTORY: "ConfigHistories",
    MEDIA: "Medias",
} as const;


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
    ATTACHED: "Attached",
    UNAVAILABLE: "Unavailable",
} as const;

export type TStateResource = (typeof STATE_RESOURCE)[keyof typeof STATE_RESOURCE];
export const STATE_RESOURCE_ARRAY = Object.values(STATE_RESOURCE);

export const stateResourceRole = new StateController<TStateResource>();
stateResourceRole.addState(STATE_RESOURCE.ON_HOLD, [STATE_RESOURCE.AVAILABLE, STATE_RESOURCE.UNAVAILABLE]);
stateResourceRole.addState(STATE_RESOURCE.AVAILABLE, [STATE_RESOURCE.ATTACHED, STATE_RESOURCE.UNAVAILABLE]);
stateResourceRole.addState(STATE_RESOURCE.ATTACHED, [STATE_RESOURCE.UNAVAILABLE]);
stateResourceRole.addState(STATE_RESOURCE.UNAVAILABLE, []);

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
