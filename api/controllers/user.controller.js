import User from "../models/user.model.js";
import { errorHandler } from '../utils/error.js';

export const deleteUser = async (req, res, next) => {
    if (req.user.id != req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('accessToken');
        res.status(200).send('User has been deleted!');
    } catch (error) {
        res.send(error);
    }
}