"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { ArrowLeft, Search, Filter, User, MapPin, DollarSign, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { id } from "date-fns/locale"

// Mock data warga dengan sistem bulatan pembayaran
const mockResidents = [
  {
    id: 1,
    name: "Budi Santoso",
    houseNumber: "A-10",
    rtRw: "RT 001/RW 005",
    totalAmount: 50000,
    paidAmount: 50000,
    installments: 5, // Harus bayar 5 kali
    completedPayments: 5, // Sudah bayar 5 kali
    lastPayment: "2024-08-25"
  },
  {
    id: 2,
    name: "Siti Aminah",
    houseNumber: "B-05",
    rtRw: "RT 002/RW 005",
    totalAmount: 40000,
    paidAmount: 20000,
    installments: 4,
    completedPayments: 2, // Baru bayar 2 dari 4 kali
    lastPayment: "2024-08-15"
  },
  {
    id: 3,
    name: "Ahmad Rahman",
    houseNumber: "C-12",
    rtRw: "RT 003/RW 005",
    totalAmount: 60000,
    paidAmount: 0,
    installments: 6,
    completedPayments: 0, // Belum bayar sama sekali
    lastPayment: null
  },
  {
    id: 4,
    name: "Dewi Kartika",
    houseNumber: "D-08",
    rtRw: "RT 001/RW 006",
    totalAmount: 30000,
    paidAmount: 10000,
    installments: 3,
    completedPayments: 1,
    lastPayment: "2024-08-10"
  }
]

// Mock data periode
const mockPeriod = {
  id: 1,
  name: "17 Agustus 2024",
  description: "Tagihan peringatan kemerdekaan RI ke-79",
  startDate: "2024-08-01",
  endDate: "2024-08-31"
}

// Mock data pembayaran harian
const mockDailyPayments = [
  { date: "2024-08-01", residentName: "Budi Santoso", amount: 10000, installment: 1 },
  { date: "2024-08-01", residentName: "Siti Aminah", amount: 10000, installment: 1 },
  { date: "2024-08-03", residentName: "Budi Santoso", amount: 10000, installment: 2 },
  { date: "2024-08-05", residentName: "Dewi Kartika", amount: 10000, installment: 1 },
  { date: "2024-08-10", residentName: "Siti Aminah", amount: 10000, installment: 2 },
  { date: "2024-08-15", residentName: "Budi Santoso", amount: 10000, installment: 3 },
  { date: "2024-08-17", residentName: "Budi Santoso", amount: 20000, installment: 4 },
  { date: "2024-08-20", residentName: "Budi Santoso", amount: 10000, installment: 5 },
  { date: "2024-08-25", residentName: "Ahmad Rahman", amount: 15000, installment: 1 }
]

export default function PeriodDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [residents, setResidents] = useState(mockResidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

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

  // Fungsi untuk mendapatkan pembayaran berdasarkan tanggal
  const getPaymentsByDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return mockDailyPayments.filter(payment => payment.date === dateString)
  }

  // Fungsi untuk mendapatkan total pembayaran per hari
  const getDailyPaymentTotal = (date: Date) => {
    const payments = getPaymentsByDate(date)
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  // Fungsi untuk mengecek apakah ada pembayaran di tanggal tertentu
  const hasPaymentOnDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return mockDailyPayments.some(payment => payment.date === dateString)
  }

  // Fungsi untuk mendapatkan statistik pembayaran harian
  const getDailyStats = () => {
    const today = new Date()
    const startDate = startOfMonth(today)
    const endDate = endOfMonth(today)
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })
    
    return daysInMonth.map(date => ({
      date,
      payments: getPaymentsByDate(date),
      total: getDailyPaymentTotal(date),
      count: getPaymentsByDate(date).length
    }))
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

  // Custom day renderer untuk kalender
  const customDayContent = (day: Date) => {
    const hasPayment = hasPaymentOnDate(day)
    const dayTotal = getDailyPaymentTotal(day)
    const paymentCount = getPaymentsByDate(day).length
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className={hasPayment ? 'font-bold text-blue-600' : ''}>
          {format(day, 'd')}
        </span>
        {hasPayment && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    )
  }

  const totalResidents = residents.length
  const completedResidents = residents.filter(r => r.completedPayments === r.installments).length
  const partialResidents = residents.filter(r => r.completedPayments > 0 && r.completedPayments < r.installments).length
  const unpaidResidents = residents.filter(r => r.completedPayments === 0).length

  // Data pembayaran untuk tanggal yang dipilih
  const selectedDatePayments = selectedDate ? getPaymentsByDate(selectedDate) : []
  const selectedDateTotal = selectedDate ? getDailyPaymentTotal(selectedDate) : 0

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
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{mockPeriod.name}</h1>
          <p className="text-muted-foreground">{mockPeriod.description}</p>
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Kalender Pembayaran
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {showCalendar ? 'Sembunyikan' : 'Tampilkan'} Kalender
              </Button>
            </div>
            <CardDescription>
              Klik tanggal untuk melihat detail pembayaran harian
            </CardDescription>
          </CardHeader>
          {showCalendar && (
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                locale={id}
                components={{
                  DayContent: ({ date }) => customDayContent(date)
                }}
              />
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
          )}
        </Card>

        {/* Daily Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pembayaran Hari Ini
            </CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Pembayaran</div>
                  <div className="text-lg font-bold text-blue-700">
                    {formatCurrency(selectedDateTotal)}
                  </div>
                  <div className="text-xs text-blue-600">
                    {selectedDatePayments.length} transaksi
                  </div>
                </div>

                {selectedDatePayments.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Detail Transaksi:</div>
                    {selectedDatePayments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded">
                        <div className="font-medium text-sm">{payment.residentName}</div>
                        <div className="text-xs text-muted-foreground">
                          Cicilan ke-{payment.installment} • {formatCurrency(payment.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Tidak ada pembayaran di tanggal ini</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran Mingguan</CardTitle>
          <CardDescription>
            Statistik pembayaran dalam periode {mockPeriod.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-7">
            {getDailyStats().slice(0, 7).map((day, index) => (
              <div 
                key={index} 
                className={`text-center p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedDate && isSameDay(selectedDate, day.date) 
                    ? 'bg-blue-100 border-2 border-blue-300' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="text-sm font-medium">
                  {format(day.date, 'EEE', { locale: id })}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {format(day.date, 'dd/MM')}
                </div>
                <div className={`text-lg font-bold ${day.count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {day.count}
                </div>
                <div className="text-xs text-muted-foreground">
                  {day.count > 0 ? formatCurrency(day.total) : 'Kosong'}
                </div>
                {day.count > 0 && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            ))}
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
                        {resident.lastPayment && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Terakhir: {resident.lastPayment}
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