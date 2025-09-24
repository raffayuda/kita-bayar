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
import { Plus, Edit, Trash2, ArrowLeft, DollarSign, Settings } from "lucide-react"
import Link from "next/link"

// Mock data jenis tagihan
const initialBillTypes = [
  {
    id: 1,
    name: "Iuran Bulanan",
    description: "Iuran rutin setiap bulan untuk operasional RT/RW",
    baseAmount: 50000,
    icon: "💰",
    color: "bg-blue-100",
    isActive: true,
    periodsCount: 4
  },
  {
    id: 2,
    name: "17 Agustusan",
    description: "Iuran khusus peringatan kemerdekaan RI",
    baseAmount: 25000,
    icon: "🇮🇩",
    color: "bg-red-100",
    isActive: true,
    periodsCount: 1
  },
  {
    id: 3,
    name: "Keamanan",
    description: "Iuran untuk biaya keamanan lingkungan",
    baseAmount: 30000,
    icon: "🛡️",
    color: "bg-green-100",
    isActive: true,
    periodsCount: 2
  },
  {
    id: 4,
    name: "Kebersihan",
    description: "Iuran untuk biaya kebersihan lingkungan",
    baseAmount: 20000,
    icon: "🧹",
    color: "bg-yellow-100",
    isActive: false,
    periodsCount: 0
  }
]

interface BillType {
  id?: number
  name: string
  description: string
  baseAmount: number
  icon: string
  color: string
  isActive: boolean
  periodsCount?: number
}

export default function ManageBillTypesPage() {
  const [billTypes, setBillTypes] = useState(initialBillTypes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<BillType | null>(null)
  const [formData, setFormData] = useState<BillType>({
    name: "",
    description: "",
    baseAmount: 0,
    icon: "💰",
    color: "bg-blue-100",
    isActive: true
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingType) {
      // Update existing
      setBillTypes(prev => prev.map(type => 
        type.id === editingType.id 
          ? { ...formData, id: editingType.id, periodsCount: type.periodsCount }
          : type
      ))
    } else {
      // Create new
      const newId = Math.max(...billTypes.map(t => t.id), 0) + 1
      setBillTypes(prev => [...prev, { ...formData, id: newId, periodsCount: 0 }])
    }
    
    resetForm()
  }

  const handleEdit = (type: BillType) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description,
      baseAmount: type.baseAmount,
      icon: type.icon,
      color: type.color,
      isActive: type.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jenis tagihan ini?")) {
      setBillTypes(prev => prev.filter(type => type.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      baseAmount: 0,
      icon: "💰",
      color: "bg-blue-100",
      isActive: true
    })
    setEditingType(null)
    setIsDialogOpen(false)
  }

  const iconOptions = ["💰", "🇮🇩", "🛡️", "🧹", "🏠", "⚡", "💧", "📱", "🚗", "🎯"]
  const colorOptions = [
    { name: "Biru", value: "bg-blue-100" },
    { name: "Merah", value: "bg-red-100" },
    { name: "Hijau", value: "bg-green-100" },
    { name: "Kuning", value: "bg-yellow-100" },
    { name: "Ungu", value: "bg-purple-100" },
    { name: "Pink", value: "bg-pink-100" },
    { name: "Indigo", value: "bg-indigo-100" },
    { name: "Gray", value: "bg-gray-100" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bills">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kelola Jenis Tagihan</h1>
            <p className="text-muted-foreground">
              Atur jenis-jenis tagihan yang tersedia
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingType(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Jenis Tagihan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingType ? "Edit Jenis Tagihan" : "Tambah Jenis Tagihan Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingType ? "Ubah informasi jenis tagihan" : "Buat jenis tagihan baru untuk warga"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Jenis Tagihan</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Iuran Bulanan"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Jelaskan untuk apa jenis tagihan ini"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="baseAmount">Jumlah Dasar</Label>
                  <Input
                    id="baseAmount"
                    type="number"
                    value={formData.baseAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseAmount: parseInt(e.target.value) || 0 }))}
                    placeholder="50000"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        className={`p-2 border rounded ${formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Warna</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded ${color.value} border-2 ${formData.color === color.value ? 'border-gray-800' : 'border-gray-300'}`}
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <Label htmlFor="isActive">Aktif</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingType ? "Simpan Perubahan" : "Tambah Jenis Tagihan"}
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
            <CardTitle className="text-sm font-medium">Total Jenis</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Periode</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billTypes.reduce((sum, type) => sum + (type.periodsCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua jenis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Rata-rata</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(billTypes.reduce((sum, type) => sum + type.baseAmount, 0) / billTypes.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per jenis tagihan
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
              {formatCurrency(billTypes.reduce((sum, type) => sum + type.baseAmount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua jenis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bill Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jenis Tagihan</CardTitle>
          <CardDescription>
            Kelola semua jenis tagihan yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Tagihan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Jumlah Dasar</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center text-lg`}>
                        {type.icon}
                      </div>
                      <div>
                        <div className="font-medium">{type.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={type.description}>
                      {type.description}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(type.baseAmount)}
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/admin/bills/types/${type.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {type.periodsCount || 0} periode
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={type.isActive ? "default" : "secondary"}
                      className={type.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {type.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => type.id && handleDelete(type.id)}
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
          
          {billTypes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada jenis tagihan.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Jenis Tagihan Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}