import { IUserDocument } from '../model/User.model';
import { IStudentDocument } from '../model/Student.model';
import { IProfessorDocument } from '../model/Professor.model';
import { IDepartmentDocument } from '../model/Department.model';
import { IResourceDocument } from 'model/Resource.model';
import { ITaxonomyDocument } from '../model/Taxonomy.model';
import { IPostulationDocument } from '../model/Postulation.model';

export type UserPublic = Omit<IUserDocument, 'user_password' | 'user_reset_passwords'>;

export interface IUserMeAggregate extends Omit<UserPublic, 'user_avatar'> {
    user_avatar: IResourceDocument;
    student_doc?: IStudentDocument;
    professor_doc?: IProfessorDocument; 
    department_managed_doc: IDepartmentDocument;
    taxonomies_managed_doc: ITaxonomyDocument[];
    postulation_docs: IPostulationDocument[];
}

export interface IUserAggregate extends UserPublic {
    student?: IStudentDocument;
    professor?: IProfessorDocument; 
}