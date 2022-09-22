// express router export
import * as express from 'express';
import * as bodyParser from 'body-parser';

const router: express.Router = express.Router();
router.use(bodyParser.json());

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('OK');
});

// POST: /api/auth/register route
router.post('/register', (req: express.Request, res: express.Response) => {
    // check if all fields are present
    let requiredFields = ['username', 'password', 'email', 'firstName', 'lastName', 'roles', 'phoneNumber'];
    let missingFields = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            missingFields.push(requiredFields[i]);
        }
    }
    if (missingFields.length > 0) {
        return res.status(400).send({
            message: `Missing fields: ${missingFields.join(', ')}`,
        });
    }

    // return 200 OK
    res.status(200).send({
        message: 'OK',
    });

});

export default router;
