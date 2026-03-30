import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const User = (await import('./models/User.js')).default;
    const user = await User.findOne({ email: "artisan_test_7@example.com" });
    console.log(user);
    process.exit(0);
});
