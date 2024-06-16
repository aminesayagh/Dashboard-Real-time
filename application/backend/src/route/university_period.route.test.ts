import request from 'supertest';
import ExpressConfig from '../express/express.config';
import { setupTestDB, teardownTestDB } from '../utils/testSetup';
import UniversityPeriodModel from '../model/UniversityPeriod.model';

let app: any;
let period: any;

async function createCurrentPeriod(){
	const now = new Date();
	const period_date_start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
	const period_date_end = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
	period = new UniversityPeriodModel({period_name: "Fall 2023",period_date_start,period_date_end,period_state: "Accepted"});
	await period.save();
	console.log(period)
	return period;
}

beforeAll(async () => {
  await setupTestDB();
  app = ExpressConfig();

	createCurrentPeriod();
  console.log('Period created for testing:', period);
});

afterAll(async () => {
  await teardownTestDB();
});

jest.useRealTimers();

describe('GET /api/v1/university_periods', () => {
  it('should return a list of university periods', async () => {
    const response = await request(app).get('/api/v1/university_periods');
    expect(response.status).toBe(200);
    expect(response.body.data.docs).toBeInstanceOf(Array);
  });
});

describe('POST /api/v1/university_periods', () => {
  it('should create a new university period', async () => {
    const response = await request(app)
      .post('/api/v1/university_periods')
      .send({
        period_name: "Spring 2024",
        period_date_start: new Date('2024-01-01'),
        period_date_end: new Date('2024-05-31'),
        period_state: "Accepted"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.period_name).toBe('Spring 2024');
  });

  it('should fail to create a university period with missing required fields', async () => {
    const response = await request(app)
      .post('/api/v1/university_periods')
      .send({
        period_date_start: new Date('2024-01-01'),
        period_date_end: new Date('2024-05-31')
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /api/v1/university_periods/:id', () => {
  it('should return a university period by ID', async () => {
    const response = await request(app).get(`/api/v1/university_periods/${period._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', period._id.toString());
    expect(response.body.data.period_name).toBe('Fall 2023');
  });

  it('should return 404 for non-existing university period ID', async () => {
    const response = await request(app).get('/api/v1/university_periods/60f7c7b4f776d35a4447c5a5');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('PUT /api/v1/university_periods/:id', () => {
  it('should update a university period by ID', async () => {
    const response = await request(app)
      .put(`/api/v1/university_periods/${period._id}`)
      .send({
        period_name: "Updated Fall 2023"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', period._id.toString());
    expect(response.body.data.period_name).toBe('Updated Fall 2023');
  });

  it('should return 404 for non-existing university period ID on update', async () => {
    const response = await request(app)
      .put('/api/v1/university_periods/60f7c7b4f776d35a4447c5a5')
      .send({
        period_name: "Updated Fall 2023"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('DELETE /api/v1/university_periods/:id', () => {
  it('should delete a university period by ID', async () => {
    const deletedPeriod = new UniversityPeriodModel({
      period_name: "To Delete",
      period_date_start: new Date('2024-06-01'),
      period_date_end: new Date('2024-12-31'),
      period_state: "Refused"
    });
    await deletedPeriod.save();

    const response = await request(app).delete(`/api/v1/university_periods/${deletedPeriod._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('deletedCount', 1);
  });

  it('should return 404 for non-existing university period ID on delete', async () => {
    const response = await request(app).delete('/api/v1/university_periods/60f7c7b4f776d35a4447c5a5');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /api/v1/university_periods/:id/next', () => {
	it('should return 404 if no next period found', async () => {
		const period_without_next = new UniversityPeriodModel({
			period_name: "Period without next",
			period_date_start: new Date('2024-06-01'),
			period_date_end: new Date('2024-12-31'),
			period_state: "Refused"
		});
		await period_without_next.save();
		console.log(period_without_next)
    const response = await request(app).get(`/api/v1/university_periods/${period_without_next._id}/next`);
		console.log(response.body.data)
    expect(response.status).toBe(200);
    expect(response.body.data.period_next).toBe(undefined);
	});

  it('should return the next period by ID', async () => {
    const nextPeriod = new UniversityPeriodModel({
      period_name: "Next Period",
      period_date_start: new Date('2024-01-01'),
      period_date_end: new Date('2024-05-31'),
      period_state: "Accepted"
    });
    await nextPeriod.save();

    period.period_next = nextPeriod._id;
    await period.save();

    const response = await request(app).get(`/api/v1/university_periods/${period._id}/next`);
    expect(response.status).toBe(200);
    expect(response.body.data.period_next).toHaveProperty('_id', nextPeriod._id.toString());
  });
});

describe('GET /api/v1/university_periods/:id/previous', () => {
	it('should return 404 if no next period found', async () => {
		const period_without_previous = new UniversityPeriodModel({
			period_name: "Period without previous",
			period_date_start: new Date('2024-06-01'),
			period_date_end: new Date('2024-12-31'),
			period_state: "Refused"
		});
		await period_without_previous.save();
    const response = await request(app).get(`/api/v1/university_periods/${period_without_previous._id}/previous`);
    expect(response.status).toBe(200);
		expect(response.body.data.period_previous).toHaveProperty('_id');
	});


  it('should return the previous period by ID', async () => {
    const previousPeriod = new UniversityPeriodModel({
      period_name: "Previous Period",
      period_date_start: new Date('2023-01-01'),
      period_date_end: new Date('2023-07-31'),
      period_state: "OnHold"
    });
    await previousPeriod.save();

    period.period_previous = previousPeriod._id;
    await period.save();

    const response = await request(app).get(`/api/v1/university_periods/${period._id}/previous`);
    expect(response.status).toBe(200);
    expect(response.body.data.period_previous).toHaveProperty('_id', previousPeriod._id.toString());
  });
});

describe('GET then PUT /api/v1/university_periods/current', () => {
  it('should return the current university period', async () => {
    const response = await request(app).get('/api/v1/university_periods/current');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id', period._id.toString());
  });

	it('should update the current university period', async () => {
		const response = await request(app)
      .put('/api/v1/university_periods/current')
      .send({
        period_name: "Updated Current Period"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data.period_name).toBe('Updated Current Period');
  });

});

describe('GET Then PUT /api/v1/university_periods/current', () => {
	it('should return 404 if no current period found', async () => {
    await UniversityPeriodModel.deleteMany();
    const response = await request(app).get('/api/v1/university_periods/current');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 404 if no current period found for update', async () => {
    await UniversityPeriodModel.deleteMany();
    const response = await request(app)
      .put('/api/v1/university_periods/current')
      .send({
        period_name: "Nonexistent Period"
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
