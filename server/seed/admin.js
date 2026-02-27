require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/hash');
const adminsData = require('./admins.json');

async function seedAdmins() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGO_DB_NAME });
        console.log('Connected to MongoDB');

        let createdCount = 0;
        let skippedCount = 0;

        for (const admin of adminsData.admins) {
            const exists = await User.findOne({ email: admin.email });
            if (exists) {
                console.log(`⊘ Admin ${admin.email} already exists, skipping...`);
                skippedCount++;
                continue;
            }

            const hashedPassword = await hashPassword(admin.password);
            await User.create({
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                role: admin.role,
                profile: admin.profile
            });
            console.log(`✓ Admin ${admin.email} created successfully`);
            createdCount++;
        }

        console.log(`\n✓ Seeding complete: ${createdCount} admins created, ${skippedCount} skipped`);
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding admins:', err.message);
        mongoose.disconnect();
        process.exit(1);
    }
}

seedAdmins();
