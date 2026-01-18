/**
 * Simple script to create or update an admin user
 * Usage: npx tsx scripts/create-admin.ts <email> <password> [name]
 * Example: npx tsx scripts/create-admin.ts admin@example.com admin123 "Admin User"
 */

import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { db } from '../lib/db'

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || 'Admin User'

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email> <password> [name]')
    console.error('Example: npx tsx scripts/create-admin.ts admin@example.com admin123 "Admin User"')
    process.exit(1)
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await db.user.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: name,
      },
      create: {
        email: email.toLowerCase().trim(),
        name: name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('✅ Admin user created/updated successfully!')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   Role: ${admin.role}`)
    console.log(`\n   You can now login at: http://localhost:3000/login`)
    console.log(`   Admin panel: http://localhost:3000/admin`)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

createAdmin()
