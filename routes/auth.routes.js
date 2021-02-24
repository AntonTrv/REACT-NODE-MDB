const {Router} = require('express');
const bcrypt = require('bcryptjs'); //encrypts the password data
const {check, validationResult} = require('express-validator'); //validates data from inputs on server (middleWare)
const User = require('../models/User'); //importing User model collection for DB
const jwt = require('jsonwebtoken');//JSON TOKEN
const config = require('config');//secret data object
const router = Router();


// /api/auth/register
router.post('/register',
    [
        check('email', 'incorrect email').isEmail(),//check if email value Is Email
        check('password', 'minimal length of the pass is 6 symbols').isLength({min: 6})//check if passwords length >= 6
    ],//array of middleWares
    async (req, res) => {
    try {

        const errors = validationResult(req);// validates fields values through middleWare

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Incorrect data. Check your input values"
            })
        }

        const {email, password} = req.body;
        const candidate = await User.findOne({email}); //check if a user is unique

        if(candidate) {//check if candidate is not empty === user was found and not unique
            return res.status(400).json({message: `User with this email: ${email} already exists!`});
        };

        const hashedPassword = await bcrypt.hash(password, 12);//hashing the password(able to compare later)
        const user = new User({email: email, password: hashedPassword});//create new element in User collection of DB

        await user.save();//saves user
        res.status(200).json({message: 'User has been created'});//responds with 200 status and creates a new user in User collection of DB
    }
    catch(err) {
        res.status(500).json({ message:`Something wen wrong! Error info: ${err}`});
    }
});

// /api/auth/login
router.post('/login',
    [
        check('email', 'Enter a correct email').normalizeEmail().isEmail(),//check if email value Is Email
        check('password', 'Enter a correct password').exists()//check if passwords length >= 6
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);// validates fields values through middleWare

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "User not found. Incorrect login or password."
            })
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});//checks if this email is in the DB

        if(!user) {
            return res.status(400).json({
                message: `User with this email: ${email}doesn't exist`//if User doesn't exist returns 400
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);//check the pass input value with the db results

        if(!isMatch) {
            return  res.status(400).json({message: 'Wrong password'});//if password doesn't match, then throw 400
        }

        //generating token
        const token = jwt.sign(
            { userId: user.id },
            config.get("jwtSecret"),
            {  expiresIn: "1h" }
            )

        res.json({token, userId: user.id})

    }
    catch(err) {
        res.status(500).json({ message:`Something wen wrong! Error info: ${err}`});
    }
});



module.exports = router;