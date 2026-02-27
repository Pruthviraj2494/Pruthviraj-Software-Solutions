require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/hash');
const usersData = require('./users.json');

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGO_DB_NAME });
        console.log('Connected to MongoDB');

        let createdCount = 0;
        let skippedCount = 0;

        for (const user of usersData.users) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`⊘ User ${user.email} already exists, skipping...`);
                skippedCount++;
                continue;
            }

            const hashedPassword = await hashPassword(user.password);
            await User.create({
                name: user.name,
                email: user.email,
                password: hashedPassword,
                role: user.role,
                profile: user.profile
            });
            console.log(`✓ User ${user.email} created successfully`);
            createdCount++;
        }

        console.log(`\n✓ Seeding complete: ${createdCount} users created, ${skippedCount} skipped`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding users:', err.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedUsers();

