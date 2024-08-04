import request from 'supertest';
import ExpressConfig from '../express/express.config';
import { setupTestDB, teardownTestDB } from '../utils/testSetup';
import DepartmentModel from '../model/Department.model';
import LocationModel from '../model/Location.model';
import PostulationModel from '../model/Postulation.model';
import UserModel from '../model/User.model';
import mongoose from 'mongoose';

let app: any;
let user: any;
let department: any;
let location: any;
let postulation: any;

async function createUser() {
  user = new UserModel({
    user_first_name: "Alice",
    user_last_name: "Smith",
    user_email: "alice.smith@example.com",
    user_password: "securepassword",
    user_roles: ["VISITOR"],
    user_gender: "women",
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
    department_name: "Science Department",
    responsible_id: user._id
  });
  await department.save();
  return department;
}

async function createLocation() {
  if (!department) {
    await createDepartment();
  }
  location = new LocationModel({
    location_name: "Lab 101",
    location_reference: "L101",
    department_id: department._id
  });
  await location.save();
  return location;
}

async function createPostulation() {
  if (!department) {
    await createDepartment();
  }
  postulation = new PostulationModel({
    resources_id: [],
    user_id: user._id,
    postulation_department_id: department._id,
    postulation_state: "OnHold",
    postulation_type: new mongoose.Types.ObjectId(),
    postulation_content: []
  });
  await postulation.save();
  return postulation;
}

beforeAll(async () => {
  await setupTestDB();
  app = ExpressConfig();
  await createUser();
  await createDepartment();
  await createLocation();
  await createPostulation();
});

afterAll(async () => {
  await teardownTestDB();
});

jest.useRealTimers();

describe('Department API Tests', () => {
  describe('GET /api/v1/departments', () => {
    it('should return a list of departments', async () => {
      const response = await request(app).get('/api/v1/departments');
      expect(response.status).toBe(200);
      expect(response.body.data.docs).toBeInstanceOf(Array);
      expect(response.body.data.docs.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/departments', () => {
    it('should create a new department', async () => {
      const response = await request(app)
        .post('/api/v1/departments')
        .send({
          department_name: "Math Department",
          responsible_id: user._id
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.department_name).toBe('Math Department');
    });
  });

  describe('GET /api/v1/departments/:id', () => {
    it('should return a department by ID', async () => {
      const response = await request(app).get(`/api/v1/departments/${department._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', department._id.toString());
      expect(response.body.data.department_name).toBe('Science Department');
    });

    it('should return 404 for non-existing department ID', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).get(`/api/v1/departments/${nonExistingId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/v1/departments/:id', () => {
    it('should update a department by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/departments/${department._id}`)
        .send({
          department_name: "Updated Science Department"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', department._id.toString());
      expect(response.body.data.department_name).toBe('Updated Science Department');
    });

    it('should return 404 for non-existing department ID on update', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/v1/departments/${nonExistingId}`)
        .send({
          department_name: "Updated Department"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/v1/departments/:id', () => {
    it('should delete a department by ID', async () => {
      const deletedDepartment = new DepartmentModel({
        department_name: "Temporary Department",
        responsible_id: user._id
      });
      await deletedDepartment.save();
      const response = await request(app).delete(`/api/v1/departments/${deletedDepartment._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', deletedDepartment._id.toString());
    });

    it('should return 404 for non-existing department ID on delete', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).delete(`/api/v1/departments/${nonExistingId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/v1/departments/:id/locations', () => {
    it('should return locations for a given department ID', async () => {
      const response = await request(app).get(`/api/v1/departments/${department._id}/locations`);
      expect(response.status).toBe(200);
      expect(response.body.data.docs).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/v1/departments/:id/locations', () => {
    it('should create a location for a given department ID', async () => {
      const response = await request(app)
        .post(`/api/v1/departments/${department._id}/locations`)
        .send({
          location_name: "New Lab",
          location_reference: "NL123"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.location_name).toBe('New Lab');
    });
  });

  describe('GET /api/v1/departments/:id/locations/:location_id', () => {
    it('should return a location by ID', async () => {
      const response = await request(app).get(`/api/v1/departments/${department._id}/locations/${location._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', location._id.toString());
      expect(response.body.data.location_name).toBe('Lab 101');
    });
  });

  describe('PUT /api/v1/departments/:id/locations/:location_id', () => {
    it('should update a location by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/departments/${department._id}/locations/${location._id}`)
        .send({
          location_name: "Updated Lab"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', location._id.toString());
      expect(response.body.data.location_name).toBe('Updated Lab');
    });
  });

  describe('DELETE /api/v1/departments/:id/locations/:location_id', () => {
    it('should delete a location by ID', async () => {
      const deletedLocation = new LocationModel({
        location_name: "Temporary Lab",
        location_reference: "TL101",
        department_id: department._id
      });
      await deletedLocation.save();
      const response = await request(app).delete(`/api/v1/departments/${department._id}/locations/${deletedLocation._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', deletedLocation._id.toString());
    });
  });

  describe('GET /api/v1/departments/:id/postulations', () => {
    it('should return postulations for a given department ID', async () => {
      const response = await request(app).get(`/api/v1/departments/${department._id}/postulations`);
      expect(response.status).toBe(200);
      expect(response.body.data.docs).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/v1/departments/:id/postulations', () => {
    it('should create a postulation for a given department ID', async () => {
      const response = await request(app)
        .post(`/api/v1/departments/${department._id}/postulations`)
        .send({
          resources_id: [],
          user_id: user._id,
          postulation_state: "Accepted",
          postulation_type: new mongoose.Types.ObjectId(),
          postulation_content: []
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
    });
  });

  describe('GET /api/v1/departments/:id/postulations/:postulation_id', () => {
    it('should return a postulation by ID', async () => {
      const response = await request(app).get(`/api/v1/departments/${department._id}/postulations/${postulation._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', postulation._id.toString());
    });
  });

  describe('PUT /api/v1/departments/:id/postulations/:postulation_id', () => {
    it('should update a postulation by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/departments/${department._id}/postulations/${postulation._id}`)
        .send({
          postulation_state: "Refused"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', postulation._id.toString());
      expect(response.body.data.postulation_state).toBe('Refused');
    });
  });

  describe('DELETE /api/v1/departments/:id/postulations/:postulation_id', () => {
    it('should delete a postulation by ID', async () => {
      const deletedPostulation = new PostulationModel({
        resources_id: [],
        user_id: user._id,
        postulation_department_id: department._id,
        postulation_state: "Accepted",
        postulation_type: new mongoose.Types.ObjectId(),
        postulation_content: []
      });
      await deletedPostulation.save();
      const response = await request(app).delete(`/api/v1/departments/${department._id}/postulations/${deletedPostulation._id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', deletedPostulation._id.toString());
    });
  });
});
