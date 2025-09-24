"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ArrowLeft, Calendar, Users, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Mock data untuk periode tagihan
const initialPeriods = [
  {
    id: 1,
    name: "Januari 2024",
    description: "Iuran bulan Januari tahun 2024",
    amount: 50000,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    dueDate: new Date("2024-01-10"),
    status: "active",
    billsCount: 45,
    paidCount: 32,
    installments: 1,
    allowPartialPayment: false
  },
  {
    id: 2,
    name: "Februari 2024", 
    description: "Iuran bulan Februari tahun 2024",
    amount: 50000,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-29"),
    dueDate: new Date("2024-02-10"),
    status: "active",
    billsCount: 45,
    paidCount: 28,
    installments: 1,
    allowPartialPayment: false
  },
  {
    id: 3,
    name: "Maret 2024",
    description: "Iuran bulan Maret tahun 2024", 
    amount: 50000,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-31"),
    dueDate: new Date("2024-03-10"),
    status: "draft",
    billsCount: 0,
    paidCount: 0,
    installments: 1,
    allowPartialPayment: false
  },
  {
    id: 4,
    name: "Kegiatan 17 Agustus 2024",
    description: "Iuran untuk peringatan kemerdekaan RI ke-79",
    amount: 25000,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-08-17"),
    dueDate: new Date("2024-08-10"),
    status: "completed",
    billsCount: 45,
    paidCount: 45,
    installments: 2,
    allowPartialPayment: true
  }
]

// Mock data jenis tagihan
const billType = {
  id: 1,
  name: "Iuran Bulanan",
  description: "Iuran rutin setiap bulan untuk operasional RT/RW",
  baseAmount: 50000,
  icon: "💰",
  color: "bg-blue-100"
}

interface BillPeriod {
  id?: number
  name: string
  description: string
  amount: number
  startDate: Date
  endDate: Date
  dueDate: Date
  status: "draft" | "active" | "completed" | "closed"
  billsCount?: number
  paidCount?: number
  installments: number
  allowPartialPayment: boolean
}

export default function ManagePeriodsPage({ params }: { params: { id: string } }) {
  const [periods, setPeriods] = useState(initialPeriods)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<BillPeriod | null>(null)
  const [formData, setFormData] = useState<BillPeriod>({
    name: "",
    description: "",
    amount: billType.baseAmount,
    startDate: new Date(),
    endDate: new Date(),
    dueDate: new Date(),
    status: "draft",
    installments: 1,
    allowPartialPayment: false
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { locale: id })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: "secondary" as const, label: "Draft", className: "bg-gray-100 text-gray-800" },
      active: { variant: "default" as const, label: "Aktif", className: "bg-blue-100 text-blue-800" },
      completed: { variant: "default" as const, label: "Selesai", className: "bg-green-100 text-green-800" },
      closed: { variant: "destructive" as const, label: "Ditutup", className: "bg-red-100 text-red-800" }
    }
    
    const config = variants[status as keyof typeof variants] || variants.draft
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPeriod) {
      // Update existing
      setPeriods(prev => prev.map(period => 
        period.id === editingPeriod.id 
          ? { ...formData, id: editingPeriod.id, billsCount: period.billsCount, paidCount: period.paidCount }
          : period
      ))
    } else {
      // Create new
      const newId = Math.max(...periods.map(p => p.id || 0), 0) + 1
      setPeriods(prev => [...prev, { ...formData, id: newId, billsCount: 0, paidCount: 0 }])
    }
    
    resetForm()
  }

  const handleEdit = (period: BillPeriod) => {
    setEditingPeriod(period)
    setFormData({
      name: period.name,
      description: period.description,
      amount: period.amount,
      startDate: period.startDate,
      endDate: period.endDate,
      dueDate: period.dueDate,
      status: period.status,
      installments: period.installments,
      allowPartialPayment: period.allowPartialPayment
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus periode ini?")) {
      setPeriods(prev => prev.filter(period => period.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      amount: billType.baseAmount,
      startDate: new Date(),
      endDate: new Date(),
      dueDate: new Date(),
      status: "draft",
      installments: 1,
      allowPartialPayment: false
    })
    setEditingPeriod(null)
    setIsDialogOpen(false)
  }

  const activePeriods = periods.filter(p => p.status === 'active')
  const totalBills = periods.reduce((sum, p) => sum + (p.billsCount || 0), 0)
  const totalPaid = periods.reduce((sum, p) => sum + (p.paidCount || 0), 0)
  const totalAmount = periods.reduce((sum, p) => sum + (p.amount * (p.billsCount || 0)), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bills/manage">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${billType.color} flex items-center justify-center text-lg`}>
                {billType.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{billType.name}</h1>
                <p className="text-muted-foreground">{billType.description}</p>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPeriod(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Periode
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingPeriod ? "Edit Periode" : "Tambah Periode Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingPeriod ? "Ubah informasi periode tagihan" : "Buat periode tagihan baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Periode</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Januari 2024"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi periode tagihan"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Jumlah Tagihan</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate.toISOString().split('T')[0]}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Batas Pembayaran</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="installments">Jumlah Cicilan</Label>
                    <Select 
                      value={formData.installments.toString()} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, installments: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x (Lunas)</SelectItem>
                        <SelectItem value="2">2x (2 Cicilan)</SelectItem>
                        <SelectItem value="3">3x (3 Cicilan)</SelectItem>
                        <SelectItem value="4">4x (4 Cicilan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="closed">Ditutup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowPartialPayment" 
                    checked={formData.allowPartialPayment}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowPartialPayment: e.target.checked }))}
                  />
                  <Label htmlFor="allowPartialPayment">Izinkan Pembayaran Cicilan</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingPeriod ? "Simpan Perubahan" : "Tambah Periode"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Periode</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periods.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePeriods.length} aktif
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
              {totalPaid} sudah bayar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Pembayaran</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBills > 0 ? Math.round((totalPaid / totalBills) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Rata-rata semua periode
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
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua periode
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Periods Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Periode</CardTitle>
          <CardDescription>
            Kelola periode tagihan untuk {billType.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periode</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Cicilan</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{period.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Jatuh tempo: {formatDate(period.dueDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(period.startDate)}</div>
                      <div className="text-muted-foreground">s/d {formatDate(period.endDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(period.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{period.installments}x</span>
                      {period.allowPartialPayment && (
                        <Badge variant="outline" className="text-xs">
                          Cicilan
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        {period.paidCount}/{period.billsCount}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(period.billsCount || 0) > 0 ? ((period.paidCount || 0) / (period.billsCount || 1)) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(period.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(period)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => period.id && handleDelete(period.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {periods.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada periode tagihan.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Periode Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}