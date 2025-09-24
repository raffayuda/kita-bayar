"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar, Users, DollarSign, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data untuk kategori dan periode
const mockCategory = {
  id: 1,
  name: "17 Agustusan",
  description: "Tagihan khusus peringatan kemerdekaan RI",
  color: "#EF4444",
  icon: "🇮🇩"
}

const mockPeriods = [
  {
    id: 1,
    categoryId: 1,
    name: "HUT RI 2024",
    description: "Peringatan HUT RI ke-79",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    totalBills: 25,
    paidBills: 20,
    totalAmount: 1250000,
    paidAmount: 1000000,
    isActive: true
  },
  {
    id: 2,
    categoryId: 1,
    name: "HUT RI 2023",
    description: "Peringatan HUT RI ke-78",
    startDate: "2023-08-01",
    endDate: "2023-08-31",
    totalBills: 23,
    paidBills: 23,
    totalAmount: 1150000,
    paidAmount: 1150000,
    isActive: false
  }
]

export default function CategoryPeriodsPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState(mockCategory)
  const [periods, setPeriods] = useState(mockPeriods)

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
    if (percentage === 100) return "Selesai"
    if (percentage >= 80) return "Baik"
    if (percentage >= 50) return "Sedang"
    return "Perlu Perhatian"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

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
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: category.color + '20', color: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/bills/categories/${category.id}/periods/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Periode Baru
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
              {periods.filter(p => p.isActive).length} aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periods.reduce((acc, p) => acc + p.totalBills, 0)}
            </div>
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
            <div className="text-2xl font-bold">
              {periods.reduce((acc, p) => acc + p.paidBills, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((periods.reduce((acc, p) => acc + p.paidBills, 0) / periods.reduce((acc, p) => acc + p.totalBills, 0)) * 100)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(periods.reduce((acc, p) => acc + p.totalAmount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(periods.reduce((acc, p) => acc + p.paidAmount, 0))} terkumpul
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Periods Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Periode {category.name}</h2>
          <div className="text-sm text-muted-foreground">
            Pilih periode untuk melihat detail tagihan warga
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {periods.map((period) => {
            const completionPercentage = getCompletionPercentage(period.paidBills, period.totalBills)
            const amountPercentage = getCompletionPercentage(period.paidAmount, period.totalAmount)
            
            return (
              <Card key={period.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{period.name}</CardTitle>
                    <Badge 
                      variant={period.isActive ? "default" : "secondary"}
                      className={period.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {period.isActive ? "Aktif" : "Selesai"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {period.description}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(period.startDate)} - {formatDate(period.endDate)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tagihan Dibayar</span>
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
                    <Link href={`/admin/bills/categories/${category.id}/periods/${period.id}`}>
                      Lihat Detail Warga
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Kelola jenis tagihan dan pengaturan lainnya untuk {category.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href={`/admin/bills/categories/${category.id}/types`}>
                Kelola Jenis Tagihan
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/admin/bills/categories/${category.id}/reports`}>
                Laporan Tagihan
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}