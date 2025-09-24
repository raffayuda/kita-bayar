import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kitabayar.com' },
    update: {},
    create: {
      email: 'admin@kitabayar.com',
      password: hashedPassword,
      username: 'admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created')

  // Create bill categories
  const iuranCategory = await prisma.billCategory.upsert({
    where: { name: 'Iuran Bulanan' },
    update: {},
    create: {
      name: 'Iuran Bulanan',
      description: 'Iuran rutin bulanan warga',
      color: '#3B82F6',
      icon: 'Calendar'
    },
  })

  const eventCategory = await prisma.billCategory.upsert({
    where: { name: '17 Agustusan' },
    update: {},
    create: {
      name: '17 Agustusan',
      description: 'Tagihan khusus peringatan kemerdekaan',
      color: '#EF4444',
      icon: 'Flag'
    },
  })

  const maintenanceCategory = await prisma.billCategory.upsert({
    where: { name: 'Pemeliharaan' },
    update: {},
    create: {
      name: 'Pemeliharaan',
      description: 'Biaya pemeliharaan fasilitas',
      color: '#10B981',
      icon: 'Wrench'
    },
  })

  console.log('✅ Bill categories created')

  // Create bill types for each category
  const billTypes = [
    // Iuran Bulanan
    {
      categoryId: iuranCategory.id,
      name: 'Iuran Pokok',
      description: 'Iuran pokok warga per bulan',
      baseAmount: 50000,
    },
    {
      categoryId: iuranCategory.id,
      name: 'Keamanan',
      description: 'Iuran keamanan lingkungan',
      baseAmount: 25000,
    },
    {
      categoryId: iuranCategory.id,
      name: 'Kebersihan',
      description: 'Iuran kebersihan lingkungan',
      baseAmount: 15000,
    },
    // 17 Agustusan
    {
      categoryId: eventCategory.id,
      name: 'Dekorasi',
      description: 'Biaya dekorasi 17 Agustus',
      baseAmount: 20000,
    },
    {
      categoryId: eventCategory.id,
      name: 'Doorprize',
      description: 'Biaya doorprize lomba',
      baseAmount: 30000,
    },
    // Pemeliharaan
    {
      categoryId: maintenanceCategory.id,
      name: 'Perbaikan Jalan',
      description: 'Biaya perbaikan jalan komplek',
      baseAmount: 75000,
    },
  ]

  for (const billType of billTypes) {
    await prisma.billType.upsert({
      where: { 
        categoryId_name: { 
          categoryId: billType.categoryId, 
          name: billType.name 
        } 
      },
      update: {},
      create: billType,
    })
  }

  console.log('✅ Bill types created')

  // Create periods for categories
  const periods = [
    // Iuran Bulanan
    {
      categoryId: iuranCategory.id,
      name: 'September 2024',
      description: 'Periode iuran September 2024',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
    },
    {
      categoryId: iuranCategory.id,
      name: 'Oktober 2024',
      description: 'Periode iuran Oktober 2024',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'),
    },
    // 17 Agustusan
    {
      categoryId: eventCategory.id,
      name: 'HUT RI 2024',
      description: 'Peringatan HUT RI ke-79',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-08-31'),
    },
    // Pemeliharaan
    {
      categoryId: maintenanceCategory.id,
      name: 'Q3 2024',
      description: 'Pemeliharaan kuartal 3 tahun 2024',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-09-30'),
    },
  ]

  for (const period of periods) {
    await prisma.billPeriod.upsert({
      where: { 
        categoryId_name: { 
          categoryId: period.categoryId, 
          name: period.name 
        } 
      },
      update: {},
      create: period,
    })
  }

  console.log('✅ Bill periods created')

  // Create sample staff user
  const staffPassword = await bcrypt.hash('staff123', 10)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@kitabayar.com' },
    update: {},
    create: {
      email: 'staff@kitabayar.com',
      password: staffPassword,
      username: 'staff',
      role: 'STAFF',
    },
  })

  console.log('✅ Staff user created')

  // Create sample resident
  const residentPassword = await bcrypt.hash('resident123', 10)
  const residentUser = await prisma.user.upsert({
    where: { email: 'resident@gmail.com' },
    update: {},
    create: {
      email: 'resident@gmail.com',
      password: residentPassword,
      username: 'warga1',
      role: 'RESIDENT',
    },
  })

  const resident = await prisma.resident.upsert({
    where: { userId: residentUser.id },
    update: {},
    create: {
      userId: residentUser.id,
      fullName: 'Budi Santoso',
      phoneNumber: '081234567890',
      address: 'Jl. Mawar No. 10',
      houseNumber: '10',
      rtRw: 'RT 001/RW 005',
    },
  })

  console.log('✅ Sample resident created')

  console.log('')
  console.log('🎉 Seed data berhasil dibuat!')
  console.log('Login credentials:')
  console.log('👤 Admin: admin@kitabayar.com / admin123')
  console.log('👥 Staff: staff@kitabayar.com / staff123') 
  console.log('🏠 Resident: resident@gmail.com / resident123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })