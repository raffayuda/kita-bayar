"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users, DollarSign, ArrowRight, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

// Mock data untuk jenis tagihan
const mockBillTypes = [
  {
    id: 1,
    name: "Iuran Bulanan",
    description: "Iuran rutin setiap bulan untuk operasional RT/RW",
    baseAmount: 50000,
    totalPeriods: 12, // 12 bulan
    activePeriods: 8, // 8 bulan sudah aktif
    totalBills: 360, // 30 warga x 12 bulan
    paidBills: 280,
    totalAmount: 18000000, // 360 x 50000
    paidAmount: 14000000,
    isActive: true,
    color: "bg-blue-100",
    icon: "💰"
  },
  {
    id: 2,
    name: "17 Agustusan",
    description: "Iuran khusus peringatan kemerdekaan RI",
    baseAmount: 25000,
    totalPeriods: 1, // hanya 1 periode
    activePeriods: 1,
    totalBills: 30, // 30 warga
    paidBills: 15,
    totalAmount: 750000, // 30 x 25000
    paidAmount: 375000,
    isActive: true,
    color: "bg-red-100",
    icon: "🇮🇩"
  },
  {
    id: 3,
    name: "Keamanan",
    description: "Iuran untuk keamanan dan ketertiban lingkungan",
    baseAmount: 30000,
    totalPeriods: 12,
    activePeriods: 10,
    totalBills: 300, // 30 warga x 10 bulan
    paidBills: 250,
    totalAmount: 9000000,
    paidAmount: 7500000,
    isActive: true,
    color: "bg-green-100",
    icon: "🛡️"
  },
  {
    id: 4,
    name: "Kebersihan",
    description: "Iuran untuk kebersihan dan pengelolaan sampah",
    baseAmount: 20000,
    totalPeriods: 12,
    activePeriods: 9,
    totalBills: 270, // 30 warga x 9 bulan
    paidBills: 200,
    totalAmount: 5400000,
    paidAmount: 4000000,
    isActive: true,
    color: "bg-yellow-100",
    icon: "🧹"
  }
]

export default function BillsPage() {
  const [billTypes, setBillTypes] = useState(mockBillTypes)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Tagihan</h1>
          <p className="text-muted-foreground">
            Kelola tagihan warga dan jenis tagihan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/bills/manage">
              <Settings className="mr-2 h-4 w-4" />
              Kelola Jenis Tagihan
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jenis Tagihan</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              {billTypes.filter(t => t.isActive).length} aktif
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
              {billTypes.reduce((acc, t) => acc + t.totalBills, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua jenis
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
              {billTypes.reduce((acc, t) => acc + t.paidBills, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((billTypes.reduce((acc, t) => acc + t.paidBills, 0) / billTypes.reduce((acc, t) => acc + t.totalBills, 0)) * 100)}% dari total
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
              {formatCurrency(billTypes.reduce((acc, t) => acc + t.totalAmount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(billTypes.reduce((acc, t) => acc + t.paidAmount, 0))} terkumpul
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bill Types Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Jenis Tagihan</h2>
          <div className="text-sm text-muted-foreground">
            Pilih jenis tagihan untuk melihat periode dan detail
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {billTypes.map((billType) => {
            const completionPercentage = getCompletionPercentage(billType.paidBills, billType.totalBills)
            const amountPercentage = getCompletionPercentage(billType.paidAmount, billType.totalAmount)
            
            return (
              <Card key={billType.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${billType.color} flex items-center justify-center text-2xl`}>
                        {billType.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{billType.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(billType.baseAmount)} per periode
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={billType.isActive ? "default" : "secondary"}
                      className={billType.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {billType.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {billType.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{billType.activePeriods}</div>
                      <div className="text-xs text-muted-foreground">Periode Aktif</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{billType.paidBills}</div>
                      <div className="text-xs text-muted-foreground">Sudah Bayar</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{billType.totalBills - billType.paidBills}</div>
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
                        <span>{billType.paidBills} dari {billType.totalBills}</span>
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
                        <span>{formatCurrency(billType.paidAmount)}</span>
                        <span>{formatCurrency(billType.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href={`/admin/bills/categories/${billType.id}`}>
                      Kelola {billType.name}
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
            Kelola jenis tagihan dan pengaturan lainnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/bills/settings">
                Pengaturan Tagihan
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/bills/reports">
                Laporan Tagihan
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}