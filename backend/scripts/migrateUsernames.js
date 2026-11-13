
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
async function migrateUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const users = await User.find({
            $or: [
                { username: { $exists: false } },
                { username: null },
                { username: "" },
            ],
        });

        for (const user of users) {
            const base = user.email
                .split("@")[0]
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 15) || "user";

            let username = base;
            let counter = 1;

            while (await User.findOne({ username })) {
                username = `${base}_${counter++}`;
            }

            user.username = username;
            await user.save();

            console.log(`Updated ${user.email} -> @${username}`);
        }

        console.log("Username migration completed.");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateUsers();
