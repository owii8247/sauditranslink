import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
        CredentialsProvider({
            name: "Credentials",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials?.email });
            
                console.log("User found:", user); // Add this log
            
                if (!user) return null;
            
                const isPasswordCorrect = bcrypt.compareSync(credentials?.password || '', user.password);
                console.log("Password Correct:", isPasswordCorrect); // Add this log
            
                if (!isPasswordCorrect) return null;
                
                if (!user.isApproved) return null;
            
                return { ...user.toObject(), role: user.role };
            }
            
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectDB();
            const dbUser = await User.findOne({ email: user.email });

            if (!dbUser && account.provider === "google") {
                await User.create({ name: user.name, email: user.email, isApproved: false });
                return false;  // Block new users until approved
            }

            if (dbUser && !dbUser.isApproved) return false;
            return true;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        }
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };




