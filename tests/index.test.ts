import request from 'supertest';
import app from '../src/index';

describe('Health Check', () => {
  it('GET / should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});