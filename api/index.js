import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import messageRoute from './routes/message.route.js';
import gigRoute from './routes/gig.route.js';
import conversationRoute from './routes/conversation.route.js';
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

app.use('/api/users', userRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/orders', orderRoute);
app.use('/api/messages', messageRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/conversations', conversationRoute);

app.listen(8800, () => {
    console.log('Backend server is running!');
})