const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Manish$uyal'

router.post('/createuser', [
    body('name', 'ENTER A VALID NAME').isLength({ min: 3 }),
    body('email', 'ENTER A VALID EMAIL').isEmail(),
    body('password', 'PASSWORD MUST BE ATLEAST 5 CHARACTERS').isLength({ min: 5 })
], async (req, res) => {

    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        }).then((user) => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true ;
            res.json({success, authToken });
        })
            .catch(err => {
                console.log(err)
                res.status(400).json({ error: 'EMAIL ALREADY REGISTERED', message: err.message })
            });
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.post('/login', [
    body('email', 'ENTER A VALID EMAIL').isEmail(),
    body('password', 'PASSWORD CANNOT BE BLANK').exists(),
], async (req, res) => {

    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,  errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: 'PLEASE TRY TO LOGIN WITH CORRECT CREDENTIAL' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: 'PLEASE TRY TO LOGIN WITH CORRECT CREDENTIAL' });
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.send({ success, authToken });

    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        console.log(req.user.id)
        const user = await UserModel.findById(userId).select('-password');
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(400).send('INTERNAL SERVER ERROR');
    }
});

module.exports = router;