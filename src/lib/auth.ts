import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sajibproduction.official@gmail.com',
    pass: 'dbij ypvb pljc eixh',
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  trustedOrigins: [process.env.FRONTEND_URL!],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },

  //add role in User Schema
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',

        required: false,
      },
      phone: {
        type: 'string',
        defaultValue: '',
        required: false,
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE',
        required: false,
      },
    },
  },

  //    email verification

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Blog App" <blogapp.official@gmail.com>',
          to: 'sajibproduction.official@gmail.com',
          subject: 'Verify your email address',
          text: '', // Plain-text version of the message
          html: `<b>Please verify your email by clicking <a href="${verificationUrl}">here</a></b>`, // HTML version of the message
        });
      } catch (error) {
        console.error('Error sending verification email:', error);
      }
    },
  },

  // GOOGLE LOGIN
  socialProviders: {
    google: {
      accessType: 'offline',
      prompt: 'select_account consent',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
