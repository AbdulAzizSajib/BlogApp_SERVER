import axios from 'axios';
import { prisma } from '../lib/prisma';
import { UserRole } from '../middleware/checker';

async function seedAdmin() {
  try {
    const adminData = {
      name: 'Abdul Aziz Sajib',
      email: 'abdulazizsajib@gmail.com',
      role: UserRole.ADMIN,
      password: 'sajib@12345',
    };

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
      return;
    }

    const signUpAdmin = await axios.post(
      `${process.env.Server_URL}/api/auth/sign-up/email`,
      adminData
    );
    console.log('Admin created successfully:', signUpAdmin);
    // Verify the admin user's email
    if (signUpAdmin.statusText) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log('Admin email verified successfully');
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
