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
function checkEndpoint(res: request.Response) {
    expect(res.type).toBe('application/json');

    if (res.status === StatusCodes.OK) {
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('message');
        expect(res.body.success).toBe(true);
    } else {
        expect(res.status).not.toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('message');
        expect(res.body.success).toBe(false);
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
            // note: collection.remove() has been depreceated.
            await collection.deleteMany({});
        }
    })

    // beforeEach(async () => {
    //     const collections = await mongoose.connection.db.collections();
    //
    //     for (let collection of collections) {
    //         // note: collection.remove() has been depreceated.
    //         await collection.deleteMany({});
    //     }
    // });

    afterAll((done) => {
        // Closing the DB connection allows Jest to exit successfully.
        // mongoose.connection.db.dropDatabase(() => {
        //     mongoose.connection.close(done);
        // })

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

        checkEndpoint(res);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
        });
        checkEndpoint(res);
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
        checkEndpoint(res);
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
        checkEndpoint(res);
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
        checkEndpoint(res);
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
        expect(res.type).toBe('application/json');
        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body.success).toBe(false);
    });

    // tests for login



    //
    // it('should return 404 Not Found', async () => {
    //     const res = await request(app).get('/apix');
    //     expect(res.status).toBe(StatusCodes.NOT_FOUND);
    // });
    //


});