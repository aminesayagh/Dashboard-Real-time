import request from 'supertest';
import ExpressConfig from '../express/express.config';
import { setupTestDB, teardownTestDB } from '../utils/testSetup';
import StudentModel from '../model/Student.model';
import UserModel from '../model/User.model';
import mongoose from 'mongoose';

let app: any;
let user: any;
let student: any;

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

async function createStudent() {
  if (!user) {
    await createUser();
  }
  student = new StudentModel({
    user_id: user._id,
    student_cne: "1234567890",
    student_number: "0987654321",
    student_state: "Accepted"
  });
  await student.save();
  return student;
}

beforeAll(async () => {
  await setupTestDB();
  app = ExpressConfig();
  await createUser();
  await createStudent();
});

afterAll(async () => {
  await teardownTestDB();
});

jest.useRealTimers();

describe('Student API Tests', () => {
  describe('POST /api/v1/students', () => {
    it('should create a new student', async () => {
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
        .post('/api/v1/students')
        .send({
          user_id: post_user._id,
          student_cne: "1234567891",
          student_number: "0987654322",
          student_state: "Accepted"
        })
        .set('Accept', 'application/json');

        console.log(response.body)

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.student_cne).toBe('1234567891');
    });

    it('should return error if user does not exist', async () => {
      const nonExistingUserId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post('/api/v1/students')
        .send({
          user_id: nonExistingUserId,
          student_cne: "1234567892",
          student_number: "0987654323",
          student_state: "Accepted"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /api/v1/students/:id', () => {
    it('should update a student by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/students/${student._id}`)
        .send({
          student_cne: "9876543210"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('_id', student._id.toString());
      expect(response.body.data.student_cne).toBe('9876543210');
    });

    it('should return 404 for non-existing student ID on update', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/v1/students/${nonExistingId}`)
        .send({
          student_cne: "9876543211"
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Not Found');
    });
  });
});
