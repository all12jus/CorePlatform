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
            error: `Missing fields: ${missingFields.join(', ')}`,
        });
    }


    // check if username is already taken
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            return res.status(500).send({
                success: false,
                error: err.message || 'Some error occurred while retrieving users.',
            });
        }
        if (user) {
            return res.status(409).send({
                success: false,
                error: 'Username is already taken',
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
                    error: err.message || 'Some error occurred while creating the User.',
                });
            }
            res.status(201).send({
                success: true,
                data: newUser,
            });
        });

    });

});

// POST: /api/auth/login route
router.post('/login', (req: express.Request, res: express.Response) => {

    //
    // check if all fields are present
    //
    let requiredFields = ['username', 'password'];
    let missingFields = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            missingFields.push(requiredFields[i]);
        }
    }
    if (missingFields.length > 0) {
        return res.status(400).send({
            success: false,
            error: `Missing fields: ${missingFields.join(', ')}`,
        });
    }

    //
    // check if user exists
    //
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            return res.status(500).send({
                success: false,
                error: err.message || 'Some error occurred while retrieving users.',
            });
        }
        if (!user) {
            return res.status(404).send({
                success: false,
                error: 'User not found',
            });
        }

        //
        // check if password is correct
        //
        if (user.password !== req.body.password) {
            return res.status(401).send({
                success: false,
                error: 'Incorrect password',
            });
        }

        //
        // login success - return user
        //
        res.status(200).send({
            success: true,
            data: {
                user,
                // token: '1234567890',
            },
        });
    });
});
export default router;
