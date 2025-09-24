import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing login credentials...');

    // Test admin login
    const adminEmail = 'admin@kitabayar.com';
    const adminPassword = 'admin123';

    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { resident: true }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive
    });

    const isPasswordValid = await bcrypt.compare(adminPassword, user.password);
    console.log('🔐 Password check:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

    if (isPasswordValid) {
      console.log('🎉 Login should work!');
    } else {
      console.log('🔧 Creating new password hash...');
      const newHash = await bcrypt.hash(adminPassword, 10);
      console.log('New hash:', newHash);
      
      // Update user with new hash
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: newHash }
      });
      console.log('✅ Password updated');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();