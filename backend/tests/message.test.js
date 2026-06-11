const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mocking models
jest.mock('../models', () => ({
  Message: {
    create: jest.fn().mockResolvedValue({ id: 'msg-1', senderId: 'user-1', receiverId: 'user-2', content: 'Hello', createdAt: new Date() }),
    findAll: jest.fn().mockResolvedValue([{ id: 'msg-1', senderId: 'user-1', receiverId: 'user-2', content: 'Hello', read: false, createdAt: new Date() }]),
    update: jest.fn().mockResolvedValue([1]),
  },
  User: {
    findByPk: jest.fn().mockResolvedValue({ id: 'user-1', username: 'Alice' }),
    findOne: jest.fn().mockResolvedValue({ id: 'user-1', username: 'Alice' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'user-2', username: 'Bob', number: '0987654321', profile: {} }]),
  },
  UserProfile: {}
}));

const messageRoutes = require('../routes/message.routes');

const app = express();
app.use(bodyParser.json());
app.use('/api/messages', messageRoutes);

describe('Message API', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('userid', 'user-1')
      .send({ receiverId: 'user-2', content: 'Hello' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'Hello');
  });

  it('should get conversation with a user', async () => {
    const res = await request(app)
      .get('/api/messages/user-2')
      .set('userid', 'user-1');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0]).toHaveProperty('content', 'Hello');
  });

  it('should get all conversations', async () => {
    const res = await request(app)
      .get('/api/messages/conversations')
      .set('userid', 'user-1');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
