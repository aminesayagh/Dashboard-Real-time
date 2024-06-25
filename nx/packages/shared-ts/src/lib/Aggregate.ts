import { 
    IUserDocument, 
    IStudentDocument, 
    IProfessorDocument, 
    IDepartmentDocument, 
    IResourceDocument, 
    ITaxonomyDocument, 
    IPostulationDocument
} from './Model';


export type IUserMeAggregate<ObjectId, Document> = Omit<IUserDocument<ObjectId, Document>, 'user_avatar'> & {
    user_avatar: IResourceDocument<ObjectId, Document>
    student_doc?: IStudentDocument<ObjectId, Document>
    professor_doc?: IProfessorDocument<ObjectId, Document>
    department_managed_doc: IDepartmentDocument<ObjectId, Document>
    taxonomies_managed_doc: ITaxonomyDocument<ObjectId, Document>[];
    postulation_docs: IPostulationDocument<ObjectId, Document>[];
}

export type IUserAggregate<ObjectId, Document> = IUserDocument<ObjectId, Document> & {
    student?: IStudentDocument<ObjectId, Document>;
    professor?: IProfessorDocument<ObjectId, Document>;
}