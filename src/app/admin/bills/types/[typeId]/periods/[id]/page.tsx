"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, User, MapPin, DollarSign, Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

// Mock data warga dengan sistem bulatan pembayaran dan tanggal
const mockResidents = [
  {
    id: 1,
    name: "Budi Santoso",
    houseNumber: "A-10",
    rtRw: "RT 001/RW 005",
    totalAmount: 50000,
    paidAmount: 50000,
    installments: 5,
    completedPayments: 5,
    payments: [
      { date: "2024-09-01", amount: 10000, installment: 1 },
      { date: "2024-09-05", amount: 10000, installment: 2 },
      { date: "2024-09-10", amount: 10000, installment: 3 },
      { date: "2024-09-15", amount: 10000, installment: 4 },
      { date: "2024-09-20", amount: 10000, installment: 5 }
    ]
  },
  {
    id: 2,
    name: "Siti Aminah",
    houseNumber: "B-05",
    rtRw: "RT 002/RW 005",
    totalAmount: 40000,
    paidAmount: 20000,
    installments: 4,
    completedPayments: 2,
    payments: [
      { date: "2024-09-03", amount: 10000, installment: 1 },
      { date: "2024-09-12", amount: 10000, installment: 2 }
    ]
  },
  {
    id: 3,
    name: "Ahmad Rahman",
    houseNumber: "C-12",
    rtRw: "RT 003/RW 005",
    totalAmount: 60000,
    paidAmount: 0,
    installments: 6,
    completedPayments: 0,
    payments: []
  }
]

const mockPeriod = {
  id: 3,
  name: "September 2024",
  description: "Iuran bulanan September 2024",
  billTypeName: "Iuran Bulanan",
  startDate: "2024-09-01",
  endDate: "2024-09-30"
}

export default function PeriodDetailPage() {
  const params = useParams()
  const router = useRouter()
  const typeId = params.typeId as string
  const periodId = params.id as string
  const [residents, setResidents] = useState(mockResidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1)) // September 2024

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100)
  }

  const getStatusColor = (completed: number, total: number) => {
    const percentage = getCompletionPercentage(completed, total)
    if (percentage === 100) return "text-green-600"
    if (percentage > 0) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusText = (completed: number, total: number) => {
    const percentage = getCompletionPercentage(completed, total)
    if (percentage === 100) return "Lunas"
    if (percentage > 0) return "Sebagian"
    return "Belum Bayar"
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  const getPaymentsOnDate = (date: number) => {
    const dateStr = `2024-09-${date.toString().padStart(2, '0')}`
    const payments = []
    residents.forEach(resident => {
      resident.payments.forEach(payment => {
        if (payment.date === dateStr) {
          payments.push({
            residentName: resident.name,
            amount: payment.amount,
            installment: payment.installment
          })
        }
      })
    })
    return payments
  }

  const hasPaymentOnDate = (date: number) => {
    return getPaymentsOnDate(date).length > 0
  }

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.houseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesFilter = true
    if (filterStatus === "LUNAS") {
      matchesFilter = resident.completedPayments === resident.installments
    } else if (filterStatus === "SEBAGIAN") {
      matchesFilter = resident.completedPayments > 0 && resident.completedPayments < resident.installments
    } else if (filterStatus === "BELUM_BAYAR") {
      matchesFilter = resident.completedPayments === 0
    }
    
    return matchesSearch && matchesFilter
  })

  // Render bulatan pembayaran
  const renderPaymentCircles = (completed: number, total: number) => {
    const circles = []
    for (let i = 0; i < total; i++) {
      const isCompleted = i < completed
      circles.push(
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
            isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'bg-gray-100 border-gray-300 text-gray-500'
          }`}
        >
          {i + 1}
        </div>
      )
    }
    return circles
  }

  // Calendar rendering
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasPayment = hasPaymentOnDate(day)
      const paymentsOnDate = getPaymentsOnDate(day)
      
      days.push(
        <div
          key={day}
          className={`h-12 border rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition-colors ${
            hasPayment 
              ? 'bg-green-100 border-green-300 hover:bg-green-200' 
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
          title={hasPayment ? `${paymentsOnDate.length} pembayaran` : 'Tidak ada pembayaran'}
        >
          <span className={`font-medium ${hasPayment ? 'text-green-800' : 'text-gray-600'}`}>
            {day}
          </span>
          {hasPayment && (
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1"></div>
          )}
        </div>
      )
    }

    return days
  }

  const totalResidents = residents.length
  const completedResidents = residents.filter(r => r.completedPayments === r.installments).length
  const partialResidents = residents.filter(r => r.completedPayments > 0 && r.completedPayments < r.installments).length
  const unpaidResidents = residents.filter(r => r.completedPayments === 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/bills/types/${typeId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{mockPeriod.name}</h1>
          <p className="text-muted-foreground">{mockPeriod.billTypeName} - {mockPeriod.description}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResidents}</div>
            <p className="text-xs text-muted-foreground">
              Yang terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Lunas</CardTitle>
            <div className="w-4 h-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedResidents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedResidents / totalResidents) * 100)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sebagian</CardTitle>
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{partialResidents}</div>
            <p className="text-xs text-muted-foreground">
              Belum selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
            <div className="w-4 h-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unpaidResidents}</div>
            <p className="text-xs text-muted-foreground">
              Perlu ditagih
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kalender Pembayaran</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-4">{formatMonthYear(currentDate)}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Hijau = ada pembayaran pada tanggal tersebut. Klik tanggal untuk melihat detail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Ada pembayaran</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Tidak ada pembayaran</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari warga atau nomor rumah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="ALL">Semua Status</option>
              <option value="LUNAS">Lunas</option>
              <option value="SEBAGIAN">Sebagian</option>
              <option value="BELUM_BAYAR">Belum Bayar</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Residents List */}
      <div className="grid gap-4">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {/* Resident Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{resident.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {resident.houseNumber}
                        </span>
                        <span>{resident.rtRw}</span>
                        {resident.payments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Terakhir: {resident.payments[resident.payments.length - 1].date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status & Amount */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Tagihan</div>
                    <div className="font-semibold">{formatCurrency(resident.totalAmount)}</div>
                    <div className="text-sm">
                      <span className={getStatusColor(resident.completedPayments, resident.installments)}>
                        {getStatusText(resident.completedPayments, resident.installments)}
                      </span>
                      {resident.paidAmount > 0 && (
                        <span className="text-muted-foreground ml-2">
                          ({formatCurrency(resident.paidAmount)} dibayar)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Circles */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground text-right mr-2">
                      {resident.completedPayments}/{resident.installments}
                    </div>
                    <div className="flex gap-1">
                      {renderPaymentCircles(resident.completedPayments, resident.installments)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Detail
                    </Button>
                    {resident.completedPayments < resident.installments && (
                      <Button size="sm">
                        Terima Bayar
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {resident.payments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Riwayat Pembayaran:</h4>
                  <div className="flex flex-wrap gap-2">
                    {resident.payments.map((payment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{payment.installment} - {payment.date} - {formatCurrency(payment.amount)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada warga yang sesuai dengan kriteria pencarian.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}