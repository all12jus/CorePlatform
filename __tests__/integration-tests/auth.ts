import 'jest';
import * as express from 'express';
import * as request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';
import App from '../../src/app';
import * as mongoose from 'mongoose';
import {ConnectOptions} from "mongoose";

// smoke test for checking if app exists


// function to check endpoint is correctly structured
function checkEndpoint(res: request.Response, success: boolean) {
    expect(res.type).toBe('application/json');
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toBe(success);
    if (success) {
        expect(res.body).toHaveProperty('data');
    }
    else {
        expect(res.body).toHaveProperty('error');
    }
}


describe('Environment', () => {
    let app: express.Application;

    // Connects to database called avengers
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/core_platform`; // core_platform
        await mongoose.connect(url, { useNewUrlParser: true } as ConnectOptions)
        app = App;

        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    })

    afterAll((done) => {
        mongoose.connection.close()
        done()
    })

    it('true to be true', async () => {
        expect(true).toBe(true);
    });

    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(StatusCodes.OK);
    });

    it('should return 200 OK', async () => {
        const res = await request(app).get('/api/auth');
        expect(res.status).toBe(StatusCodes.OK);
    });


    // tests for register
    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
        });
        // console.log(res.body);
        // console.log("res.status: ", res.status);

        checkEndpoint(res, false);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
            firstName: 'test',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
            firstName: 'test',
            lastName: 'test',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
            firstName: 'test',
            lastName: 'test',
            phone: 'test',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    // register success
    it('should return 201 Created', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            firstName: 'test',
            lastName: 'test',
            phoneNumber: 'test',
            roles: [],
        });

        // console.log(res.body);
        // checkEndpoint(res);
        checkEndpoint(res, true);
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(true);
    });

    // test when user already exists
    it('should return 409 Conflict', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            firstName: 'test',
            lastName: 'test',
            phoneNumber: 'test',
            roles: [],
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body.success).toBe(false);
    });

    // tests for login
    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'test',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/login').send({
            password: 'test',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    // wrong password
    it('should return 401 Bad Request', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'test',
            password: 'test1',
        });
        checkEndpoint(res, false);
        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
    });

    // login success
    it('should return 200 OK', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'test',
            password: 'test',
        });
        checkEndpoint(res, true);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);

        // the token is stored in the cookie
        // expect(res.header['set-cookie']).toBeDefined();



        // // cookie has to have a jwt token
        // expect(res.header['set-cookie'][0]).toMatch(/accessToken=.+; Path=\/; HttpOnly/);
        // // cookie has to have a refresh token
        // expect(res.header['set-cookie'][1]).toMatch(/refreshToken=.+; Path=\/; HttpOnly/);
    });

});