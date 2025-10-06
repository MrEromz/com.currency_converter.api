import request from 'supertest';
import app from '../src/index';

describe('Authentication', () => {
    // For a real-world scenario, you would seed the database with a test user
    // and use those credentials here.
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
    };

    let token: string;

    it('POST /api/auth/login - should login a user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    it('POST /api/auth/login - should fail with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({email: testUser.email, password: 'wrongpassword'});

        expect(response.status).toBe(401);
    });

    it('POST /api/auth/logout - should logout a user', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'Logout successful'});
    });

    it('POST /api/auth/logout - should fail without a token', async () => {
        const response = await request(app).post('/api/auth/logout');

        expect(response.status).toBe(401);
    });
});
