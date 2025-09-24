"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar, Users, DollarSign, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data jenis tagihan
const mockBillTypes: { [key: number]: {
  id: number;
  name: string;
  description: string;
  baseAmount: number;
  icon: string;
  color: string;
} } = {
  1: {
    id: 1,
    name: "Iuran Bulanan",
    description: "Iuran rutin setiap bulan untuk operasional RT/RW",
    baseAmount: 50000,
    icon: "💰",
    color: "bg-blue-100"
  },
  2: {
    id: 2,
    name: "17 Agustusan",
    description: "Iuran khusus peringatan kemerdekaan RI",
    baseAmount: 25000,
    icon: "🇮🇩",
    color: "bg-red-100"
  }
}

// Mock data periode untuk setiap jenis tagihan
type Period = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalBills: number;
  paidBills: number;
  totalAmount: number;
  paidAmount: number;
  isActive: boolean;
  status: string;
};

const mockPeriods: { [key: number]: Period[] } = {
  1: [ // Iuran Bulanan
    {
      id: 1,
      name: "Januari 2024",
      description: "Iuran bulanan Januari 2024",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      totalBills: 30,
      paidBills: 28,
      totalAmount: 1500000,
      paidAmount: 1400000,
      isActive: false,
      status: "completed"
    },
    {
      id: 2,
      name: "Februari 2024",
      description: "Iuran bulanan Februari 2024",
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      totalBills: 30,
      paidBills: 25,
      totalAmount: 1500000,
      paidAmount: 1250000,
      isActive: false,
      status: "completed"
    },
    {
      id: 3,
      name: "September 2024",
      description: "Iuran bulanan September 2024",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      totalBills: 30,
      paidBills: 20,
      totalAmount: 1500000,
      paidAmount: 1000000,
      isActive: true,
      status: "active"
    },
    {
      id: 4,
      name: "Oktober 2024",
      description: "Iuran bulanan Oktober 2024",
      startDate: "2024-10-01",
      endDate: "2024-10-31",
      totalBills: 30,
      paidBills: 10,
      totalAmount: 1500000,
      paidAmount: 500000,
      isActive: true,
      status: "active"
    }
  ],
  2: [ // 17 Agustusan
    {
      id: 5,
      name: "17 Agustus 2024",
      description: "Peringatan kemerdekaan RI ke-79",
      startDate: "2024-08-01",
      endDate: "2024-08-31",
      totalBills: 30,
      paidBills: 15,
      totalAmount: 750000,
      paidAmount: 375000,
      isActive: true,
      status: "active"
    }
  ]
}

export default function BillTypeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const billTypeId = parseInt(params.typeId as string)
  const [billType, setBillType] = useState(mockBillTypes[billTypeId])
  const [periods, setPeriods] = useState<Period[]>(mockPeriods[billTypeId] || [])

  useEffect(() => {
    if (!billType) {
      router.push('/admin/bills')
    }
  }, [billType, router])

  if (!billType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const getCompletionPercentage = (paid: number, total: number) => {
    return Math.round((paid / total) * 100)
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800"
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return "Baik"
    if (percentage >= 50) return "Sedang"
    return "Perlu Perhatian"
  }

  const getStatusBadge = (status: string, percentage: number) => {
    if (status === "completed") {
      return <Badge className="bg-gray-100 text-gray-800">Selesai</Badge>
    }
    return (
      <Badge 
        variant="default"
        className={percentage >= 80 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
      >
        {status === "active" ? "Aktif" : "Draft"}
      </Badge>
    )
  }

  if (!billType) {
    return <div>Jenis tagihan tidak ditemukan</div>
  }

  const totalBills = periods.reduce((acc: number, p: Period) => acc + p.totalBills, 0)
  const paidBills = periods.reduce((acc: number, p: Period) => acc + p.paidBills, 0)
  const totalAmount = periods.reduce((acc: number, p: Period) => acc + p.totalAmount, 0)
  const paidAmount = periods.reduce((acc: number, p: Period) => acc + p.paidAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/bills">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-12 h-12 rounded-lg ${billType.color} flex items-center justify-center text-2xl`}>
            {billType.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{billType.name}</h1>
            <p className="text-muted-foreground">{billType.description}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/bills/manage/${billTypeId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Kelola Periode
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Periode</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periods.length}</div>
            <p className="text-xs text-muted-foreground">
              {periods.filter((p: Period) => p.isActive).length} aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBills}</div>
            <p className="text-xs text-muted-foreground">
              Semua periode
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Dibayar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidBills}</div>
            <p className="text-xs text-muted-foreground">
              {totalBills > 0 ? Math.round((paidBills / totalBills) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(paidAmount)} terkumpul
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Periods Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Periode {billType.name}</h2>
          <div className="text-sm text-muted-foreground">
            Pilih periode untuk melihat detail pembayaran warga
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {periods.map((period: Period) => {
            const completionPercentage = getCompletionPercentage(period.paidBills, period.totalBills)
            const amountPercentage = getCompletionPercentage(period.paidAmount, period.totalAmount)
            
            return (
              <Card key={period.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{period.name}</CardTitle>
                    {getStatusBadge(period.status, completionPercentage)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {period.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{period.paidBills}</div>
                      <div className="text-xs text-muted-foreground">Sudah Bayar</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{period.totalBills - period.paidBills}</div>
                      <div className="text-xs text-muted-foreground">Belum Bayar</div>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress Pembayaran</span>
                      <Badge className={getStatusColor(completionPercentage)}>
                        {getStatusText(completionPercentage)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{period.paidBills} dari {period.totalBills}</span>
                        <span>{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Nilai Terkumpul</span>
                        <span>{amountPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${amountPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(period.paidAmount)}</span>
                        <span>{formatCurrency(period.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href={`/admin/bills/types/${billTypeId}/periods/${period.id}`}>
                      Lihat Detail Warga
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {periods.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum ada periode</h3>
                <p className="text-gray-500 mb-4">Belum ada periode untuk jenis tagihan {billType.name}. Buat periode pertama untuk mulai mengelola tagihan.</p>
                <Button asChild>
                  <Link href={`/admin/bills/manage/${billTypeId}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Periode Pertama
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}