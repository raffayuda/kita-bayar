"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Receipt, Eye, TrendingUp } from "lucide-react"

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Mock data - akan diganti dengan data dari database
  const payments = [
    {
      id: 1,
      receiptNumber: "KBR-2025-001",
      residentName: "Budi Santoso",
      billType: "Iuran Bulanan",
      amount: 50000,
      paymentDate: "2025-09-24",
      paymentMethod: "CASH",
      notes: "Pembayaran lunas bulan September",
      createdAt: "2025-09-24"
    },
    {
      id: 2,
      receiptNumber: "KBR-2025-002",
      residentName: "Siti Aminah",
      billType: "Keamanan",
      amount: 25000,
      paymentDate: "2025-09-23",
      paymentMethod: "BANK_TRANSFER",
      notes: "Transfer via BCA",
      createdAt: "2025-09-23"
    },
    {
      id: 3,
      receiptNumber: "KBR-2025-003",
      residentName: "Ahmad Rahman",
      billType: "Kebersihan",
      amount: 15000,
      paymentDate: "2025-09-23",
      paymentMethod: "DIGITAL_WALLET",
      notes: "Pembayaran via OVO",
      createdAt: "2025-09-23"
    },
    {
      id: 4,
      receiptNumber: "KBR-2025-004",
      residentName: "Dewi Kartika",
      billType: "Iuran Bulanan",
      amount: 50000,
      paymentDate: "2025-09-22",
      paymentMethod: "CASH",
      notes: "Pembayaran tunai",
      createdAt: "2025-09-22"
    },
    {
      id: 5,
      receiptNumber: "KBR-2025-005",
      residentName: "Andi Wijaya",
      billType: "Kas RT",
      amount: 10000,
      paymentDate: "2025-09-22",
      paymentMethod: "CASH",
      notes: "Kas RT periode September",
      createdAt: "2025-09-22"
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Badge className="bg-green-100 text-green-800">Tunai</Badge>
      case 'BANK_TRANSFER':
        return <Badge className="bg-blue-100 text-blue-800">Transfer Bank</Badge>
      case 'DIGITAL_WALLET':
        return <Badge className="bg-purple-100 text-purple-800">E-Wallet</Badge>
      case 'CHECK':
        return <Badge className="bg-orange-100 text-orange-800">Cek/Giro</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const filteredPayments = payments.filter(payment =>
    payment.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.billType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPayments = payments.length
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const todayPayments = payments.filter(p => p.paymentDate === "2025-09-24").length
  const thisMonthAmount = payments.reduce((sum, payment) => sum + payment.amount, 0) // Simplified

  const paymentMethods = [
    { method: "CASH", count: payments.filter(p => p.paymentMethod === "CASH").length },
    { method: "BANK_TRANSFER", count: payments.filter(p => p.paymentMethod === "BANK_TRANSFER").length },
    { method: "DIGITAL_WALLET", count: payments.filter(p => p.paymentMethod === "DIGITAL_WALLET").length },
    { method: "CHECK", count: payments.filter(p => p.paymentMethod === "CHECK").length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-gray-600">Kelola dan pantau semua pembayaran warga</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Catat Pembayaran
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pembayaran</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">Semua pembayaran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayPayments}</div>
            <p className="text-xs text-muted-foreground">Pembayaran masuk</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">Seluruh pembayaran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(thisMonthAmount)}</div>
            <p className="text-xs text-muted-foreground">September 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Metode Pembayaran</CardTitle>
          <CardDescription>Distribusi pembayaran berdasarkan metode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paymentMethods.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">
                    {item.method === 'CASH' ? 'Tunai' : 
                     item.method === 'BANK_TRANSFER' ? 'Transfer Bank' :
                     item.method === 'DIGITAL_WALLET' ? 'E-Wallet' : 'Cek/Giro'}
                  </p>
                  <p className="text-xs text-gray-500">{item.count} pembayaran</p>
                </div>
                {getPaymentMethodBadge(item.method)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian & Filter</CardTitle>
          <CardDescription>Cari pembayaran berdasarkan nama warga, nomor kwitansi, atau jenis tagihan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari pembayaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter Metode</Button>
            <Button variant="outline">Filter Tanggal</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
          <CardDescription>Data pembayaran yang telah diterima dari warga</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Kwitansi</TableHead>
                <TableHead>Nama Warga</TableHead>
                <TableHead>Jenis Tagihan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium font-mono text-sm">
                    {payment.receiptNumber}
                  </TableCell>
                  <TableCell className="font-medium">{payment.residentName}</TableCell>
                  <TableCell>{payment.billType}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell className="max-w-xs truncate">{payment.notes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title="Lihat detail">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Cetak kwitansi">
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada pembayaran yang sesuai dengan kriteria pencarian.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}