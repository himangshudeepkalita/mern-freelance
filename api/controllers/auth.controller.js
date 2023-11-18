import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const register =  async (req, res, next) => {
    // const { username, email, password, country } = req.body;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).send('User has been created!');
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    // const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ username: req.body.username });
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcrypt.compareSync(req.body.password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong password or username!'));

        const token = jwt.sign({
            id: validUser._id,
            isSeller: validUser.isSeller
        }, process.env.JWT_KEY);

        const {password, ...rest} = validUser._doc;
        res.cookie('accessToken', token, { httpOnly: true }).status(200).send(rest);
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', {
            sameSite: 'none',
            secure: true
        });
        res.status(200).send('User has been logged out!');
    } catch (error) {
        next(error);
    }
}