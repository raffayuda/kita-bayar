import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test connection dengan query sederhana
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful!')
    console.log('Test result:', result)
    
    // Test membuat tabel jika belum ada
    console.log('📋 Checking database schema...')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()