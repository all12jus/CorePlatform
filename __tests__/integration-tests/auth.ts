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

describe('Environment', () => {
    let app: express.Application;

    // Connects to database called avengers
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/${new Date().getTime()}`;
        await mongoose.connect(url, { useNewUrlParser: true } as ConnectOptions)
        app = App;
    })

    afterAll(done => {
        // Closing the DB connection allows Jest to exit successfully.
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
        // expect response to be in json format
        expect(res.type).toBe('application/json');
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);

    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
        });
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
            firstName: 'test',
        });
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return 400 Bad Request', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'test',
            password: 'test',
            email: 'test',
            firstName: 'test',
            lastName: 'test',
        });
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
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
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    // register success
    // it('should return 201 Created', async () => {
    //     const res = await request(app).post('/api/auth/register').send({
    //         username: 'test',
    //         password: 'test',
    //         email: 'test',
    //         firstName: 'test',
    //         lastName: 'test',
    //         phone: 'test',
    //         role: [],
    //     });
    //     expect(res.status).toBe(StatusCodes.CREATED);
    // });


    //
    // it('should return 404 Not Found', async () => {
    //     const res = await request(app).get('/apix');
    //     expect(res.status).toBe(StatusCodes.NOT_FOUND);
    // });
    //


});