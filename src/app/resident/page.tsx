"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, CreditCard, AlertCircle, Calendar, Receipt, Eye } from "lucide-react"

export default function ResidentDashboard() {
  // Mock data - akan diganti dengan data dari database berdasarkan session user
  const residentData = {
    name: "Budi Santoso",
    address: "Jl. Mawar No. 15, RT 001/RW 002",
    rtRw: "001/002"
  }

  const unpaidBills = [
    {
      id: 1,
      billType: "Iuran Bulanan",
      amount: 50000,
      dueDate: "2025-09-30",
      period: "2025-09",
      status: "UNPAID",
      daysLeft: 6
    },
    {
      id: 2,
      billType: "Keamanan",
      amount: 25000,
      dueDate: "2025-10-01",
      period: "2025-09",
      status: "UNPAID",
      daysLeft: 7
    },
    {
      id: 3,
      billType: "Kebersihan",
      amount: 15000,
      dueDate: "2025-10-01",
      period: "2025-09",
      status: "UNPAID",
      daysLeft: 7
    }
  ]

  const paymentHistory = [
    {
      id: 1,
      receiptNumber: "KBR-2025-001",
      billType: "Iuran Bulanan",
      amount: 50000,
      paymentDate: "2025-08-25",
      period: "2025-08",
      paymentMethod: "CASH"
    },
    {
      id: 2,
      receiptNumber: "KBR-2025-010",
      billType: "Keamanan",
      amount: 25000,
      paymentDate: "2025-08-20",
      period: "2025-08",
      paymentMethod: "BANK_TRANSFER"
    },
    {
      id: 3,
      receiptNumber: "KBR-2025-015",
      billType: "Kebersihan",
      amount: 15000,
      paymentDate: "2025-08-18",
      period: "2025-08",
      paymentMethod: "CASH"
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800">Lunas</Badge>
      case 'UNPAID':
        return <Badge variant="outline">Belum Bayar</Badge>
      case 'OVERDUE':
        return <Badge className="bg-red-100 text-red-800">Terlambat</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Tunai'
      case 'BANK_TRANSFER':
        return 'Transfer Bank'
      case 'DIGITAL_WALLET':
        return 'E-Wallet'
      case 'CHECK':
        return 'Cek/Giro'
      default:
        return method
    }
  }

  const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0)
  const urgentBills = unpaidBills.filter(bill => bill.daysLeft <= 7).length

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {residentData.name}!</h1>
            <p className="text-gray-600 mt-1">{residentData.address}</p>
            <p className="text-sm text-gray-500">RT/RW: {residentData.rtRw}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Portal Warga</p>
            <p className="text-xs text-gray-400">KitaBayar System</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagihan Belum Dibayar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unpaidBills.length}</div>
            <p className="text-xs text-muted-foreground">Total {formatCurrency(totalUnpaid)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segera Jatuh Tempo</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentBills}</div>
            <p className="text-xs text-muted-foreground">≤ 7 hari lagi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riwayat Pembayaran</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paymentHistory.length}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Unpaid Bills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Tagihan Belum Dibayar
          </CardTitle>
          <CardDescription>Daftar tagihan yang perlu segera dibayar</CardDescription>
        </CardHeader>
        <CardContent>
          {unpaidBills.length > 0 ? (
            <div className="space-y-4">
              {unpaidBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{bill.billType}</p>
                    <p className="text-sm text-gray-500">Periode: {bill.period}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Jatuh tempo: {bill.dueDate}</span>
                      <Badge 
                        variant={bill.daysLeft <= 3 ? "destructive" : "outline"}
                        className={bill.daysLeft <= 3 ? "" : "text-orange-600 border-orange-200"}
                      >
                        {bill.daysLeft} hari lagi
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(bill.amount)}</p>
                    <Button size="sm" className="mt-2">
                      Bayar Sekarang
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total yang harus dibayar:</span>
                  <span className="text-xl font-bold text-red-600">{formatCurrency(totalUnpaid)}</span>
                </div>
                <Button className="w-full mt-4" size="lg">
                  Bayar Semua Tagihan
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada tagihan yang belum dibayar.</p>
              <p className="text-sm text-green-600 mt-2">Semua tagihan Anda sudah lunas! 🎉</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran Terbaru</CardTitle>
          <CardDescription>Daftar pembayaran yang telah dilakukan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Kwitansi</TableHead>
                <TableHead>Jenis Tagihan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.receiptNumber}</TableCell>
                  <TableCell>{payment.billType}</TableCell>
                  <TableCell>{payment.period}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </Badge>
                  </TableCell>
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
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Fitur yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Lihat Semua Tagihan</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <CreditCard className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Riwayat Pembayaran</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Receipt className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Cetak Kwitansi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}