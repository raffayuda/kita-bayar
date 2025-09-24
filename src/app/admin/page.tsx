"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, CreditCard, TrendingUp, Calendar, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  // Mock data - akan diganti dengan data dari database
  const stats = {
    totalResidents: 150,
    unpaidBills: 45,
    totalRevenue: 75000000,
    thisMonthPayments: 25
  }

  const recentPayments = [
    { id: 1, resident: "Budi Santoso", amount: 50000, date: "2025-09-24", type: "Iuran Bulanan" },
    { id: 2, resident: "Siti Aminah", amount: 25000, date: "2025-09-23", type: "Keamanan" },
    { id: 3, resident: "Ahmad Rahman", amount: 15000, date: "2025-09-23", type: "Kebersihan" },
    { id: 4, resident: "Dewi Kartika", amount: 50000, date: "2025-09-22", type: "Iuran Bulanan" },
    { id: 5, resident: "Andi Wijaya", amount: 10000, date: "2025-09-22", type: "Kas RT" },
  ]

  const upcomingDueDates = [
    { id: 1, resident: "Muhammad Ali", amount: 50000, dueDate: "2025-09-30", type: "Iuran Bulanan" },
    { id: 2, resident: "Fatimah Zahra", amount: 25000, dueDate: "2025-10-01", type: "Keamanan" },
    { id: 3, resident: "Yusuf Ibrahim", amount: 85000, dueDate: "2025-10-02", type: "Multiple" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di sistem penagihan KitaBayar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResidents}</div>
            <p className="text-xs text-muted-foreground">Warga terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagihan Belum Bayar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaidBills}</div>
            <p className="text-xs text-muted-foreground">Perlu ditindaklanjuti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthPayments}</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran Terbaru</CardTitle>
            <CardDescription>Pembayaran yang masuk dalam 5 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{payment.resident}</p>
                    <p className="text-sm text-muted-foreground">{payment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Due Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Jatuh Tempo Mendekati
            </CardTitle>
            <CardDescription>Tagihan yang akan jatuh tempo dalam 7 hari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDueDates.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{bill.resident}</p>
                    <p className="text-sm text-muted-foreground">{bill.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(bill.amount)}</p>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {bill.dueDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses fitur yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Tambah Warga Baru</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Buat Tagihan</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <CreditCard className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Catat Pembayaran</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <TrendingUp className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">Lihat Laporan</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}