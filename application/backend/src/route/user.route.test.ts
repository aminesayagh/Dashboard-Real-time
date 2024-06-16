import request from 'supertest';
import ExpressConfig from '../express/express.config';
import { setupTestDB, teardownTestDB } from '../utils/testSetup';
import UserModel from '../model/User.model';

let app: any;
let user: any;
beforeAll(async () => {
  await setupTestDB();

  // Initialize Express app after the database connection is established
  app = ExpressConfig();

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
  
});

afterAll(async () => {
  await teardownTestDB();
});

jest.useRealTimers();

describe('GET /api/v1/users', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.status).toBe(200);
    expect(response.body.data.docs).toBeInstanceOf(Array);
  });
});

describe('POST /api/v1/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        user_first_name: "Jane",
        user_last_name: "Smith",
        user_email: "mouad@example.com",
        user_password: "anothersecurepassword",
        user_roles: ["VISITOR"],
        user_gender: "man",
        user_auth_provider: "credential"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.user_email).toBe('mouad@example.com');
  });

  it('should fail to create a user with missing required fields', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        user_email: 'jane.smith@example.com',
        user_auth_provider: 'local'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /api/v1/users/:id', () => {
  it('should return a user by ID', async () => {

    const response = await request(app).get(`/api/v1/users/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', user._id.toString());
    expect(response.body.data.user_email).toBe('john.doe@example.com');
  });

  it('should return 404 for non-existing user ID', async () => {
    const response = await request(app).get('/api/v1/users/60f7c7b4f776d35a4447c5a5'); // An example invalid ID
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('PUT /api/v1/users/:id', () => {
  it('should update a user by ID', async () => {
    const response = await request(app)
      .put(`/api/v1/users/${user._id}`)
      .send({
        user_first_name: "Johnny"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', user._id.toString());
    expect(response.body.data.user_first_name).toBe('Johnny');
  });

  it('should return 404 for non-existing user ID on update', async () => {
    const response = await request(app)
      .put('/api/v1/users/60f7c7b4f776d35a4447c5a5')
      .send({
        user_first_name: "Johnny"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('DELETE /api/v1/users/:id', () => {
  it('should delete a user by ID', async () => {
    const deleted_user = new UserModel({
      user_first_name: "deleted",
      user_last_name: "deleted",
      user_email: "deleted@example.com",
      user_password: "securepassword",
      user_roles: ["VISITOR"],
      user_gender: "man",
      user_auth_provider: "credential"
    });
    await deleted_user.save();

    const response = await request(app).delete(`/api/v1/users/${deleted_user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('deletedCount', 1);
  });

  it('should return 404 for non-existing user ID on delete', async () => {
    const response = await request(app).delete('/api/v1/users/60f7c7b4f776d35a4447c5a5');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /api/v1/users/me/:id', () => {
  it('should return user aggregate data by ID', async () => {
    const response = await request(app).get(`/api/v1/users/me/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', user._id.toString());
    expect(response.body.data.user_email).toBe('john.doe@example.com');
  });

  it('should return 404 for non-existing user ID on aggregate fetch', async () => {
    const response = await request(app).get('/api/v1/users/me/60f7c7b4f776d35a4447c5a5');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /api/v1/users/email/:email', () => {
  it('should return a user by email', async () => {
    const response = await request(app).get(`/api/v1/users/email/${user.user_email}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', user._id.toString());
    expect(response.body.data.user_email).toBe(`${user.user_email}`);
  });

  it('should return 404 for non-existing user email', async () => {
    const response = await request(app).get('/api/v1/users/email/nonexistent@example.com');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
