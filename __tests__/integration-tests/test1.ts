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
        const res = await request(app).get('/api');
        expect(res.status).toBe(StatusCodes.OK);
    });

    it('should return 404 Not Found', async () => {
        const res = await request(app).get('/apix');
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });



});