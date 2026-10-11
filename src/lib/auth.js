import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("bazar-dor");

export const auth = betterAuth({
    trustedOrigins: [
        "http://localhost:3000",
        "https://ph-b14-a07-bazar-dor.vercel.app",
    ],

    emailAndPassword: {
        enabled: true,
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"],
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
        },

        github: {
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
        },
    },

    database: mongodbAdapter(db, {
        client,
    }),
});