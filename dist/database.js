import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let DATABASE = process.env.DATABASE || "mongodb://127.0.0.1:27017/nmcnv2local";
console.log(DATABASE);
export const ConnectDatabase = () => {
    mongoose
        .connect(DATABASE, {
        connectTimeoutMS: 60000,
        serverSelectionTimeoutMS: 60000,
    })
        .then(() => {
        // syncIndexes();
        console.log("Database connected successfully");
    })
        .catch((e) => {
        console.log(e);
        console.log("DB could not connect at this time. Shutting down");
        process.exit(1);
    });
};
export const syncIndexes = async () => {
    try {
        console.log("🔄 Syncing indexes...");
        for (const name in mongoose.models) {
            console.log(`→ ${name}`);
            await mongoose.models[name].syncIndexes();
        }
        console.log("✅ Index sync complete");
    }
    catch (err) {
        console.error("❌ Index sync failed:", err);
    }
};
//# sourceMappingURL=database.js.map