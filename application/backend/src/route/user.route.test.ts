import ExpressConfig from "../express/express.config";

import request from 'supertest';
const app = ExpressConfig(); // Update this to the path of your Express app

jest.useRealTimers();

describe('GET /api/v1/users', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/api/v1/users');

    expect(response.status).toBe(200); // Assuming your endpoint returns a 200 status code for successful requests
    expect(response.body).toBeInstanceOf(Array);
  });
})

describe('POST /api/v1/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        user_first_name: "Jane",
        user_last_name: "Smith",
        user_email: "jane.smith@example.com",
        user_password: "anothersecurepassword",
        user_roles: ["VISITOR"],
        user_gender: "man",
        user_auth_provider: "credential"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201); // Assuming your endpoint returns a 201 status code for successful creation
    expect(response.body).toHaveProperty('_id');
    expect(response.body.user_email).toBe('jane.smith@example.com');
  });

  it('should fail to create a user with missing required fields', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        user_email: 'jane.smith@example.com',
        user_auth_provider: 'local'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400); // Assuming your endpoint returns a 400 status code for bad requests
    expect(response.body).toHaveProperty('error');
  });
});
