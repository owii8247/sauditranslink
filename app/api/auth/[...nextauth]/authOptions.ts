// // app/api/auth/[...nextauth]/authOptions.ts
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcrypt";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: { email: {}, password: {} },
//       async authorize(credentials) {
//         await connectDB();
//         const user = await User.findOne({ email: credentials?.email });

//         if (!user) return null;

//         const isPasswordCorrect = bcrypt.compareSync(credentials?.password || '', user.password);
//         if (!isPasswordCorrect || !user.isApproved) return null;

//         return { ...user.toObject(), role: user.role };
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       await connectDB();
//       const dbUser = await User.findOne({ email: user.email });

//       if (!dbUser && account.provider === "google") {
//         await User.create({ name: user.name, email: user.email, isApproved: false });
//         return false;
//       }

//       if (dbUser && !dbUser.isApproved) return false;
//       return true;
//     },
//     async session({ session, token }) {
//       session.user.role = token.role;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) token.role = user.role;
//       return token;
//     },
//   },
// };


import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextAuthOptions, User as NextAuthUser, Account, Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) return null;

        const isPasswordCorrect = bcrypt.compareSync(credentials?.password || '', user.password);
        if (!isPasswordCorrect || !user.isApproved) return null;

        return { ...user.toObject(), role: user.role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: NextAuthUser; account: Account | any }) {
      await connectDB();
      const dbUser = await User.findOne({ email: user.email });

      if (!dbUser && account?.provider === "google") {
        await User.create({ name: user.name, email: user.email, isApproved: false });
        return false;
      }

      if (dbUser && !dbUser.isApproved) return false;
      return true;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
  },
};