const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const Task = require('../src/models/Task');

// Use test database
const MONGODB_TEST_URI = 'mongodb://localhost:27017/taskhub-test';

beforeAll(async () => {
  await mongoose.connect(MONGODB_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('POST /api/tasks', () => {
  it('should create a task successfully with title only', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe('Test Task');
    expect(res.body.error).toBeNull();
  });

  it('should create a task with title and due date', async () => {
    const dueDate = new Date('2025-12-31').toISOString();
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task with due date', due: dueDate });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Task with due date');
    expect(res.body.data.due).toBeTruthy();
  });

  it('should return 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
    expect(res.body.data).toBeNull();
  });

  it('should return 400 when title is empty string', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('should return 400 when due date is invalid', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', due: 'invalid-date' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid date format');
  });
});

describe('GET /api/tasks', () => {
  it('should return all tasks', async () => {
    await Task.create({ title: 'Task 1' });
    await Task.create({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.error).toBeNull();
  });

  it('should filter tasks by query parameter', async () => {
    await Task.create({ title: 'Buy groceries' });
    await Task.create({ title: 'Buy milk' });
    await Task.create({ title: 'Read book' });

    const res = await request(app).get('/api/tasks?q=buy');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('should return empty array when no tasks match query', async () => {
    await Task.create({ title: 'Task 1' });

    const res = await request(app).get('/api/tasks?q=nonexistent');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('should delete a task successfully', async () => {
    const task = await Task.create({ title: 'Task to delete' });

    const res = await request(app).delete(`/api/tasks/${task._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Task to delete');

    // Verify task is deleted
    const foundTask = await Task.findById(task._id);
    expect(foundTask).toBeNull();
  });

  it('should return 404 when task not found', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).delete(`/api/tasks/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app).delete('/api/tasks/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid task ID format');
  });
});
