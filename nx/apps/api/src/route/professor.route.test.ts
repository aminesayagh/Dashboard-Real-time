import request from 'supertest';
import ExpressConfig from '../express/express.config';
import { setupTestDB, teardownTestDB } from '../utils/testSetup';
import ProfessorModel from '../model/Professor.model';
import UserModel from '../model/User.model';
import mongoose from 'mongoose';

let app: any;
let user: any;
let professor: any;

async function createUser() {
  user = new UserModel({
    user_first_name: "Jane",
    user_last_name: "Doe",
    user_email: "jane.doe@example.com",
    user_password: "securepassword",
    user_roles: ["VISITOR"],
    user_gender: "women",
    user_auth_provider: "credential"
  });
  await user.save();
  return user;
}

async function createProfessor() {
  if (!user) {
    await createUser();
  }
  professor = new ProfessorModel({
    user_id: user._id,
    professor_office_location: "Office 101",
    professor_state: "Accepted"
  });
  await professor.save();
  return professor;
}

beforeAll(async () => {
  await setupTestDB();
  app = ExpressConfig();
  await createUser();
  await createProfessor();
});

afterAll(async () => {
  await teardownTestDB();
});

jest.useRealTimers();

describe('Professor API Tests', () => {
  describe('GET /api/v1/departments', () => {
    it('should return a list of departments', async () => {
      const response = await request(app).get('/api/v1/departments');
      expect(response.status).toBe(200);
      expect(response.body.data.docs).toBeInstanceOf(Array);
      expect(response.body.data.docs.length).toBeGreaterThan(0);
    });
    
  });

  describe('POST /api/v1/professors', () => {
    it('should create a new professor', async () => {
        let post_user = new UserModel({
            user_first_name: "doe",
            user_last_name: "doe",
            user_email: "doe@example.com",
            user_password: "securepassword",
            user_roles: ["VISITOR"],
            user_gender: "man",
            user_auth_provider: "credential"
          });
          await post_user.save();
      const response = await request(app)
        .post('/api/v1/professors')
        .send({
          user_id: post_user._id,
          professor_office_location: "Office 102",
          professor_state: "Accepted"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.professor_office_location).toBe('Office 102');
    });

    it('should return error if user does not exist', async () => {
      const nonExistingUserId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post('/api/v1/professors')
        .send({
          user_id: nonExistingUserId,
          professor_office_location: "Office 103",
          professor_state: "Accepted"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /api/v1/professors/:id', () => {
    it('should update a professor by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/professors/${professor._id}`)
        .send({
          professor_office_location: "Updated Office"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', professor._id.toString());
      expect(response.body.data.professor_office_location).toBe('Updated Office');
    });

    it('should return 404 for non-existing professor ID on update', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/v1/professors/${nonExistingId}`)
        .send({
          professor_office_location: "Non-existing Office"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Not Found');
    });
  });
});
