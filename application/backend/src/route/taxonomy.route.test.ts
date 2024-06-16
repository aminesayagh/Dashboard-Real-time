import request from 'supertest';
import ExpressConfig from '../express/express.config';
import { setupTestDB, teardownTestDB } from '../utils/testSetup';
import TaxonomyModel from '../model/Taxonomy.model';
import PostulationTypeModel from '../model/PostulationType.model';
import PostulationTypeContentModel from '../model/PostulationTypeContent.model';
import DepartmentModel from '../model/Department.model';
import mongoose from 'mongoose';
import UserModel from '../model/User.model';
import UniversityPeriodModel from '../model/UniversityPeriod.model';

let app: any;
let user: any;
let department: any;
let taxonomy: any;
let postulationType: any;
let postulationTypeContent: any;
let university_period: any;

async function createUser() {
  user = new UserModel({
    user_first_name: "john",
    user_last_name: "doe",
    user_email: "john.doe@example.com",
    user_password: "securepassword",
    user_roles: ["VISITOR"],
    user_gender: "man",
    user_auth_provider: "credential"
  });
  await user.save();
  return user;
}

async function createDepartment() {
  if (!user) {
    await createUser();
  }
  department = new DepartmentModel({
    department_name: "Department 1",
    responsible_id: user._id,
  });
  await department.save();
  console.log("depart :", department)
  return department;
}

async function createTaxonomy() {
  if (!user) {
    await createUser();
  }
  taxonomy = new TaxonomyModel({
      taxonomy_type: "Type 1",
      taxonomy_value: "Value 1",
      taxonomy_parent_id: null,
      taxonomy_level: 1,
      taxonomy_responsible_id: user._id,
      taxonomy_state: "Accepted"
    });
  await taxonomy.save();
  return taxonomy;
}

async function createPostulationType() {
  if (!taxonomy) {
    taxonomy = await createTaxonomy();
  }
  if (!department) {
    department = await createDepartment();
  }
  postulationType = new PostulationTypeModel({
    taxonomies_id: [taxonomy._id],
    department_id: department._id,
    postulation_type_period: [],
    postulation_type_name: "postulation type 1",
    postulation_type_content: []
  });
  await postulationType.save();
  return postulationType;
}

async function createPostulationTypeContent() {
  postulationTypeContent = new PostulationTypeContentModel({
    postulation_type_content_name: "Content 1",
    postulation_type_content_description: "Description 1",
    postulation_type_content_type: "Users",
    postulation_type_content_required: false,
    postulation_type_content_options: ["Option 1", "Option 2"] 
  });
  await postulationTypeContent.save();
  return postulationTypeContent;
}

async function createUniversityPeriod(){
	const now = new Date();
	const period_date_start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
	const period_date_end = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
	university_period = new UniversityPeriodModel({period_name: "Fall 2023",period_date_start,period_date_end,period_state: "Accepted"});
	await university_period.save();
	console.log(university_period)
	return university_period;
}

beforeAll(async () => {
  await setupTestDB();
  app = ExpressConfig();
  createDepartment();
  createTaxonomy();
  createPostulationType();
  createPostulationTypeContent();
  createUniversityPeriod();
});

afterAll(async () => {
  await teardownTestDB();
});


jest.useRealTimers();


describe('Taxonomy API Tests', () => {
  describe('GET /api/v1/taxonomies', () => {
    it('should return a list of taxonomies', async () => {
      const response = await request(app).get('/api/v1/taxonomies');
      expect(response.status).toBe(200);
      expect(response.body.data.docs).toBeInstanceOf(Array);
      expect(response.body.data.docs.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/taxonomies', () => {
    it('should create a new taxonomy', async () => {
      const response = await request(app)
        .post('/api/v1/taxonomies')
        .send({
          taxonomy_type: "Type 2",
          taxonomy_value: "Value 2",
          taxonomy_parent_id: new mongoose.Types.ObjectId().toString(),
          taxonomy_level: 2,
          taxonomy_responsible_id: new mongoose.Types.ObjectId().toString(),
          taxonomy_state: "Accepted"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.taxonomy_value).toBe('Value 2');
    });
  });

  describe('GET /api/v1/taxonomies/:id', () => {
    it('should return a taxonomy by ID', async () => {
      const response = await request(app).get(`/api/v1/taxonomies/${taxonomy._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', taxonomy._id.toString());
      expect(response.body.data.taxonomy_value).toBe('Value 1');
    });

    it('should return 404 for non-existing taxonomy ID', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).get(`/api/v1/taxonomies/${nonExistingId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/v1/taxonomies/:id', () => {
    it('should update a taxonomy by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/taxonomies/${taxonomy._id}`)
        .send({
          taxonomy_value: "Updated Value"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', taxonomy._id.toString());
      expect(response.body.data.taxonomy_value).toBe('Updated Value');
    });

    it('should return 404 for non-existing taxonomy ID on update', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/v1/taxonomies/${nonExistingId}`)
        .send({
          taxonomy_value: "Updated Value"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/v1/taxonomies/:id', () => {
    it('should delete a taxonomy by ID', async () => {
      const deleted_taxonomy = new TaxonomyModel({
        taxonomy_type: "Type 2",
        taxonomy_value: "To Delete",
        taxonomy_level: 1,
        taxonomy_responsible_id: user._id,
        taxonomy_state: "Accepted"
      });
      await deleted_taxonomy.save();
      const response = await request(app).delete(`/api/v1/taxonomies/${deleted_taxonomy._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('deletedCount', 1);
    });
    
    it('should return 404 for non-existing taxonomy ID on delete', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).delete(`/api/v1/taxonomies/${nonExistingId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('deletedCount', 0);
    });
  });

  describe('GET /api/v1/taxonomies/:id/postulation_types', () => {
    it('should return postulation types for a given taxonomy ID', async () => {
      const response = await request(app).get(`/api/v1/taxonomies/${taxonomy._id}/postulation_types`);
      expect(response.status).toBe(200);
      expect(response.body.data.docs).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/v1/taxonomies/:id/postulation_types', () => {
    it('should create postulation types for a given taxonomy ID', async () => {
      const response = await request(app)
        .post(`/api/v1/taxonomies/${taxonomy._id}/postulation_types`)
        .send({
          postulation_type_name: "New Postulation Type",
          postulation_type_period: [university_period._id],
          postulation_type_content: [postulationTypeContent._id],
          department_id: department._id
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.postulation_type_name).toBe('New Postulation Type');
    });
  });

  describe('GET /api/v1/taxonomies/:id/postulation_types/:postulation_type_id', () => {
    it('should return a specific postulation type by taxonomy and postulation type ID', async () => {
      const response = await request(app).get(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${postulationType._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', postulationType._id.toString());
    });
  });

  describe('PUT /api/v1/taxonomies/:id/postulation_types/:postulation_type_id', () => {
    it('should update a specific postulation type by taxonomy and postulation type ID', async () => {
      const response = await request(app)
        .put(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${postulationType._id}`)
        .send({
          postulation_type_name: "Updated Postulation Type"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', postulationType._id.toString());
      expect(response.body.data.postulation_type_name).toBe('Updated Postulation Type');
    });
  });

  describe('DELETE /api/v1/taxonomies/:id/postulation_types/:postulation_type_id', () => {
    it('should delete a specific postulation type by taxonomy and postulation type ID', async () => {
      const deleted_postulation_type = new PostulationTypeModel({
        taxonomies_id: [taxonomy._id],
        department_id: department._id,
        postulation_type_period: [],
        postulation_type_name: "To Delete",
        postulation_type_content: []
      });
      await deleted_postulation_type.save();
      const response = await request(app).delete(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${deleted_postulation_type._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('deletedCount', 1);
    });
  });

  describe('POST /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content', () => {
    it('should create postulation type content', async () => {
      const response = await request(app)
        .post(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${postulationType._id}/postulation_type_content`)
        .send({
          postulation_type_content_name: "New Content",
          postulation_type_content_description: "New Description",
          postulation_type_content_type: "Users",
          postulation_type_content_required: false,
          postulation_type_content_options: ["Option 1", "Option 2"]
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.postulation_type_content_name).toBe('New Content');
    });
  });

  describe('GET /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', () => {
    it('should return postulation type content by ID', async () => {
      const response = await request(app).get(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${postulationType._id}/postulation_type_content/${postulationTypeContent._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', postulationTypeContent._id.toString());
      expect(response.body.data.postulation_type_content_name).toBe('Content 1');
    });
  });

  describe('PUT /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', () => {
    it('should update postulation type content by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${postulationType._id}/postulation_type_content/${postulationTypeContent._id}`)
        .send({
          postulation_type_content_name: "Updated Content"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', postulationTypeContent._id.toString());
      expect(response.body.data.postulation_type_content_name).toBe('Updated Content');
    });
  });

  describe('DELETE /api/v1/taxonomies/:id/postulation_types/:postulation_type_id/postulation_type_content/:content_id', () => {
    it('should delete postulation type content by ID', async () => {
      const response = await request(app).delete(`/api/v1/taxonomies/${taxonomy._id}/postulation_types/${postulationType._id}/postulation_type_content/${postulationTypeContent._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('deletedCount', 1);
    });
  });

  // describe('GET /api/v1/taxonomies/types/:type', () => {
  //   it('should return taxonomies by type', async () => {
  //     const response = await request(app).get(`/api/v1/taxonomies/types/Type 1`);
  //     expect(response.status).toBe(200);
  //     expect(response.body.data.docs).toBeInstanceOf(Array);
  //   });
  // });

  // describe('PUT /api/v1/taxonomies/types/:type', () => {
  //   it('should update taxonomies by type', async () => {
  //     const response = await request(app)
  //       .put(`/api/v1/taxonomies/types/Type 1`)
  //       .send({
  //         taxonomy_value: "Updated Value"
  //       })
  //       .set('Accept', 'application/json');

  //     expect(response.status).toBe(200);
  //     expect(response.body.data).toHaveProperty('count');
  //     expect(response.body.data.count).toBeGreaterThan(0);
  //   });
  // });

  // describe('DELETE /api/v1/taxonomies/types/:type', () => {
  //   it('should delete taxonomies by type', async () => {
  //     const response = await request(app).delete(`/api/v1/taxonomies/types/Type 1`);
  //     expect(response.status).toBe(200);
  //     expect(response.body.data).toHaveProperty('deletedCount');
  //   });
  // });
});