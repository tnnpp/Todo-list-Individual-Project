import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; 
import { ensureDatabase, sql } from "@/lib/neon";

export const authOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const { email, password } = credentials;
  
          try {
            await ensureDatabase();
            const [user] = await sql`
              SELECT id, email, username, password
              FROM users
              WHERE email = ${email}
              LIMIT 1
            `;
  
            if (!user) {
              throw new Error("User not found");
            }
            const isValid = await bcrypt.compare(password, user.password);
  
            if (!isValid) {
              throw new Error("Invalid password");
            }
            return { id: user.id, email: user.email, username: user.username };
            }
            catch (error) {
              console.log("Error in authorization: ", error);
              return null; 
            }
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.username = token.username;
          session.user.email = token.email;
        }
        return session;
      },
    },
  };
  