import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const register =  async (req, res) => {
    // const { username, email, password, country } = req.body;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).send('User has been created!');
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

export const login = async (req, res) => {
    // const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ username: req.body.username });
        if (!validUser) return res.status(404).send('User not found!');

        const validPassword = bcrypt.compareSync(req.body.password, validUser.password);
        if(!validPassword) return res.status(400).send('Wrong password or username!');

        const token = jwt.sign({
            id: validUser._id,
            isSeller: validUser.isSeller
        }, process.env.JWT_KEY);

        const {password, ...rest} = validUser._doc;
        res.cookie('accessToken', token, { httpOnly: true }).status(200).send(rest);
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}