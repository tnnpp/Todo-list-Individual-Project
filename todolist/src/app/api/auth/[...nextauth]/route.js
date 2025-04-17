import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import User from "@/models/User"; 
import dbConnect from '@/lib/mongodb';

export const authOptions = {
  providers: [
    // Credentials provider for email/password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect(); // Connect to DB (you may use your own DB connection logic)

        // Find user by email
        const user = await User.findOne({ email: credentials?.email });

        // If no user is found, return null
        if (!user) return null;

        // Compare password (use bcryptjs or bcrypt for hashing)
        const isValid = await compare(credentials?.password || "", user.password);

        if (!isValid) return null; // If password doesn't match, return null

        // Return the user object
        return { id: user._id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page (optional)
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
