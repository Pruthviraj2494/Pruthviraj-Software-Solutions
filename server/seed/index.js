require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/hash');

const adminsData = require('./admins.json');
const usersData = require('./users.json');

async function seedAllUsers() {
    let createdCount = 0;
    let skippedCount = 0;

    const allUsers = [
        ...(adminsData.admins || []),
        ...(usersData.users || [])
    ];

    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGO_DB_NAME });
        console.log('Connected to MongoDB');

        for (const user of allUsers) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`⊘ ${user.role} ${user.email} already exists, skipping...`);
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

            console.log(`✓ ${user.role} ${user.email} created successfully`);
            createdCount++;
        }

        console.log(`\n✓ Seeding complete: ${createdCount} created, ${skippedCount} skipped`);
    } catch (err) {
        console.error('Error seeding users:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedAllUsers();

