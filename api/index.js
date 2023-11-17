import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import messageRoute from './routes/message.route.js';
import gigRoute from './routes/gig.route.js';
import conversationRoute from './routes/conversation.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to DB!");
    })
    .catch((err) => {
        console.log(err);
    })

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/orders', orderRoute);
app.use('/api/messages', messageRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/auth', authRoute);

app.use( (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
} )

app.listen(8800, () => {
    console.log('Backend server is running!');
})