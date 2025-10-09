import request from 'supertest';
import app from '../src/index';
import prisma from '../src/config/prisma';
import logger from '../src/config/logger'
import bcrypt from "bcrypt";

describe('Authentication', () => {

    const testUser = {
        email: `test1760019789458@example.com`,
        password: 'password123',
        firstname: 'marko',
        lastname: 'vanbasten'
    };

    const loginUser = {
        email: "test1760019789458@example.com",
        password: testUser.password
    }

    let token: string;

    it('POST /api/v1/session/signup - should create a new user and return a token', async () => {
        const response = await request(app)
            .post('/api/v1/session/signup')
            .send(testUser);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token; // Save token for subsequent tests
    });

    it('POST /api/v1/session/signup - should fail if user already exists', async () => {
        const response = await request(app)
            .post('/api/v1/session/signup')
            .send(testUser);

        expect(response.status).toBe(409);
    });

    it('POST /api/v1/session/login - should login an existing user and return a token', async () => {
        logger.warn(loginUser)
        const response = await request(app)
            .post('/api/v1/session/login')
            .send(loginUser);

        token = response.body.token;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('POST /api/v1/session/login - should fail with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/v1/session/login')
            .send(loginUser);

        expect(response.status).toBe(401);
    });

    it('POST /api/v1/session/logout - should logout a user', async () => {
        const loginResponse = await request(app)
            .post('/api/v1/session/login')
            .send(loginUser);

        const response = await request(app)
            .post('/api/v1/session/logout')
            .set('Authorization', `Bearer ${loginResponse.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'Logout successful'});
    });

    it('POST /api/v1/session/logout - should fail without a token', async () => {
        const response = await request(app).post('/api/v1/session/logout');
        expect(response.status).toBe(401);
    });

});
