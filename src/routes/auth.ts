// express router export
import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as User from "../models/User";
import { model as User }  from "../models/User";


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
            success: false,
            message: `Missing fields: ${missingFields.join(', ')}`,
        });
    }


    // check if username is already taken
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: err.message || 'Some error occurred while retrieving users.',
            });
        }
        if (user) {
            return res.status(409).send({
                success: false,
                message: 'Username is already taken',
            });
        }


        // create new user
        let newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roles: req.body.roles,
            phoneNumber: req.body.phoneNumber,
        });
        newUser.save((err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: err.message || 'Some error occurred while creating the User.',
                });
            }
            res.status(201).send({
                success: true,
                message: 'OK',
            });
        });

    });

});

export default router;
