import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Fetching residents from database...')
    const residents = await prisma.resident.findMany({ 
      orderBy: { createdAt: 'desc' } 
    })
    console.log('✅ Found residents:', residents.length)
    
    // Transform data to match frontend interface
    const transformedResidents = residents.map(resident => ({
      id: resident.id,
      fullName: resident.fullName,
      email: resident.email || '',
      phoneNumber: resident.phoneNumber || '',
      address: resident.address || '',
      identityCard: resident.identityCard || '',
      rtRw: resident.rtRw || '',
      kelurahan: resident.kelurahan || '',
      kecamatan: resident.kecamatan || '',
      city: resident.city || '',
      postalCode: resident.postalCode || '',
      isActive: resident.isActive,
      createdAt: resident.createdAt.toISOString().split('T')[0]
    }))
    
    return NextResponse.json(transformedResidents)
  } catch (error) {
    console.error('❌ Error fetching residents:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch residents', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('✅ POST /api/residents - Received data:', data)
    
    // Validate required field
    if (!data.fullName || !data.fullName.trim()) {
      console.log('❌ Validation failed: fullName is required')
      return NextResponse.json({ error: 'fullName is required' }, { status: 400 })
    }
    
    // Create resident directly with optional fields
    const residentData = {
      fullName: data.fullName.trim(),
      email: data.email?.trim() || null,
      phoneNumber: data.phoneNumber?.trim() || null,
      address: data.address?.trim() || null,
      identityCard: data.identityCard?.trim() || null,
      rtRw: data.rtRw?.trim() || null,
      kelurahan: data.kelurahan?.trim() || null,
      kecamatan: data.kecamatan?.trim() || null,
      city: data.city?.trim() || null,
      postalCode: data.postalCode?.trim() || null,
      isActive: data.isActive ?? true
    }
    
    console.log('🔄 Creating resident with data:', residentData)
    
    const resident = await prisma.resident.create({
      data: residentData
    })
    
    console.log('✅ Created resident successfully:', resident)
    
    // Return data in expected format
    const responseData = {
      id: resident.id,
      fullName: resident.fullName,
      email: resident.email || '',
      phoneNumber: resident.phoneNumber || '',
      address: resident.address || '',
      identityCard: resident.identityCard || '',
      rtRw: resident.rtRw || '',
      kelurahan: resident.kelurahan || '',
      kecamatan: resident.kecamatan || '',
      city: resident.city || '',
      postalCode: resident.postalCode || '',
      isActive: resident.isActive,
      createdAt: resident.createdAt.toISOString().split('T')[0]
    }
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error creating resident:', error)
    return NextResponse.json({ error: 'Failed to create resident' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const { id, ...updateData } = data
    
    // Update Resident data directly
    const resident = await prisma.resident.update({
      where: { id },
      data: {
        fullName: updateData.fullName,
        email: updateData.email || null,
        phoneNumber: updateData.phoneNumber || null,
        address: updateData.address || null,
        identityCard: updateData.identityCard || null,
        rtRw: updateData.rtRw || null,
        kelurahan: updateData.kelurahan || null,
        kecamatan: updateData.kecamatan || null,
        city: updateData.city || null,
        postalCode: updateData.postalCode || null,
        isActive: updateData.isActive ?? true
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating resident:', error)
    return NextResponse.json({ error: 'Failed to update resident' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    
    // Delete resident directly
    await prisma.resident.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resident:', error)
    return NextResponse.json({ error: 'Failed to delete resident' }, { status: 500 })
  }
}
