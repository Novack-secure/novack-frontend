import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        smsOtpCode: { label: "SMS Code", type: "text", required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const payload: any = {
            email: credentials.email,
            password: credentials.password,
          };

          if (credentials.smsOtpCode) {
            payload.sms_otp_code = credentials.smsOtpCode;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (data.requires2FA) {
            // Si requiere 2FA, devolver un error especial
            throw new Error("2FA_REQUIRED");
          }

          return {
            id: data.employee.id,
            email: data.employee.email,
            name: `${data.employee.first_name} ${data.employee.last_name}`,
            accessToken: data.access_token,
            role: data.employee.role,
            supplier_id: data.employee.supplier_id,
          };
        } catch (error) {
          console.error("Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Si es un login con Google
      if (account?.provider === "google" && user) {
        try {
          // Buscar o crear usuario en nuestro backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
              image: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.accessToken = data.access_token;
            token.role = data.employee.role;
            token.supplier_id = data.employee.supplier_id;
          }
        } catch (error) {
          console.error("Error al autenticar con Google:", error);
        }
      }

      // Si es un login con credenciales
      if (user && "accessToken" in user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.supplier_id = user.supplier_id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.supplier_id = token.supplier_id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        smsOtpCode: { label: "SMS Code", type: "text", required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const payload: any = {
            email: credentials.email,
            password: credentials.password,
          };

          if (credentials.smsOtpCode) {
            payload.sms_otp_code = credentials.smsOtpCode;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (data.requires2FA) {
            // Si requiere 2FA, devolver un error especial
            throw new Error("2FA_REQUIRED");
          }

          return {
            id: data.employee.id,
            email: data.employee.email,
            name: `${data.employee.first_name} ${data.employee.last_name}`,
            accessToken: data.access_token,
            role: data.employee.role,
            supplier_id: data.employee.supplier_id,
          };
        } catch (error) {
          console.error("Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Si es un login con Google
      if (account?.provider === "google" && user) {
        try {
          // Buscar o crear usuario en nuestro backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
              image: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.accessToken = data.access_token;
            token.role = data.employee.role;
            token.supplier_id = data.employee.supplier_id;
          }
        } catch (error) {
          console.error("Error al autenticar con Google:", error);
        }
      }

      // Si es un login con credenciales
      if (user && "accessToken" in user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.supplier_id = user.supplier_id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.supplier_id = token.supplier_id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        smsOtpCode: { label: "SMS Code", type: "text", required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const payload: any = {
            email: credentials.email,
            password: credentials.password,
          };

          if (credentials.smsOtpCode) {
            payload.sms_otp_code = credentials.smsOtpCode;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (data.requires2FA) {
            // Si requiere 2FA, devolver un error especial
            throw new Error("2FA_REQUIRED");
          }

          return {
            id: data.employee.id,
            email: data.employee.email,
            name: `${data.employee.first_name} ${data.employee.last_name}`,
            accessToken: data.access_token,
            role: data.employee.role,
            supplier_id: data.employee.supplier_id,
          };
        } catch (error) {
          console.error("Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Si es un login con Google
      if (account?.provider === "google" && user) {
        try {
          // Buscar o crear usuario en nuestro backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
              image: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.accessToken = data.access_token;
            token.role = data.employee.role;
            token.supplier_id = data.employee.supplier_id;
          }
        } catch (error) {
          console.error("Error al autenticar con Google:", error);
        }
      }

      // Si es un login con credenciales
      if (user && "accessToken" in user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.supplier_id = user.supplier_id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.supplier_id = token.supplier_id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
