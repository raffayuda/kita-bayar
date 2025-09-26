"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, CreditCard, Calendar } from "lucide-react"

interface Resident {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  identityCard: string
  rtRw: string
  kelurahan: string
  kecamatan: string
  city: string
  postalCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ResidentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [resident, setResident] = useState<Resident | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch resident detail
  const fetchResident = async () => {
    setLoading(true)
    try {
      console.log('🔄 Fetching resident detail for ID:', params.id)
      const res = await fetch(`/api/residents?id=${params.id}`)
      console.log('📡 Response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.text()
        console.error('❌ API Error:', errorData)
        throw new Error(`API Error: ${res.status} ${errorData}`)
      }
      
      const data = await res.json()
      console.log('✅ Resident detail received:', data)
      
      // Jika data adalah array, ambil item pertama
      if (Array.isArray(data)) {
        const foundResident = data.find(r => r.id === params.id)
        if (foundResident) {
          setResident(foundResident)
        } else {
          throw new Error('Resident not found')
        }
      } else {
        setResident(data)
      }
    } catch (error) {
      console.error('❌ Error fetching resident:', error)
      toast.error('Gagal memuat data warga: ' + (error instanceof Error ? error.message : 'Unknown error'))
      router.push('/admin/residents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResident()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!resident) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Data warga tidak ditemukan.</p>
        <Button onClick={() => router.push('/admin/residents')} className="mt-4">
          Kembali ke Daftar Warga
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/residents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detail Warga</h1>
            <p className="text-gray-600">Informasi lengkap warga {resident.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/residents/edit/${resident.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              // This will be handled by the parent page's delete modal
              router.push('/admin/residents')
              toast.info('Gunakan tombol delete di daftar warga untuk menghapus')
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Status Warga
            </CardTitle>
            <Badge variant={resident.isActive ? "default" : "secondary"}>
              {resident.isActive ? "Aktif" : "Non-aktif"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Pribadi
            </CardTitle>
            <CardDescription>Data personal warga</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <p className="text-gray-900 font-medium">{resident.fullName}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-gray-900">{resident.email || 'Tidak ada'}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Nomor HP
              </label>
              <p className="text-gray-900">{resident.phoneNumber || 'Tidak ada'}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Nomor KTP
              </label>
              <p className="text-gray-900 font-mono">{resident.identityCard || 'Tidak ada'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informasi Alamat
            </CardTitle>
            <CardDescription>Alamat lengkap warga</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
              <p className="text-gray-900">{resident.address || 'Tidak ada'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">RT/RW</label>
                <p className="text-gray-900">{resident.rtRw || 'Tidak ada'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kelurahan</label>
                <p className="text-gray-900">{resident.kelurahan || 'Tidak ada'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kecamatan</label>
                <p className="text-gray-900">{resident.kecamatan || 'Tidak ada'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kota</label>
                <p className="text-gray-900">{resident.city || 'Tidak ada'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kode Pos</label>
              <p className="text-gray-900">{resident.postalCode || 'Tidak ada'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informasi Sistem
          </CardTitle>
          <CardDescription>Data sistem dan riwayat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tanggal Dibuat</label>
              <p className="text-gray-900">{formatDate(resident.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Terakhir Diupdate</label>
              <p className="text-gray-900">{formatDate(resident.updatedAt)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ID System</label>
            <p className="text-gray-900 font-mono text-sm">{resident.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}