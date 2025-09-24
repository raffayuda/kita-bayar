"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Users, Home, Phone, Mail, ArrowUpDown, Filter } from "lucide-react"

interface Resident {
  id?: number
  fullName: string
  email: string
  phoneNumber: string
  address: string
  identityCard: string
  rtRw: string
  kelurahan: string
  kecamatan: string
  city: string
  postalCode: string
  isActive: boolean
  createdAt?: string
}

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResident, setEditingResident] = useState<Resident | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("fullName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Resident>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [formData, setFormData] = useState<Resident>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    identityCard: "",
    rtRw: "",
    kelurahan: "",
    kecamatan: "",
    city: "",
    postalCode: "",
    isActive: true
  })
  
  // Mock data - akan diganti dengan data dari database
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: 1,
      fullName: "Budi Santoso",
      email: "budi.santoso@email.com",
      address: "Jl. Mawar No. 15",
      phoneNumber: "081234567890",
      identityCard: "3201234567890123",
      rtRw: "001/002",
      kelurahan: "Sukamaju",
      kecamatan: "Cibinong",
      city: "Bogor",
      postalCode: "16913",
      isActive: true,
      createdAt: "2025-01-15"
    },
    {
      id: 2,
      fullName: "Siti Aminah",
      email: "siti.aminah@email.com",
      address: "Jl. Melati No. 22",
      phoneNumber: "081234567891",
      identityCard: "3201234567890124",
      rtRw: "001/002",
      kelurahan: "Sukamaju",
      kecamatan: "Cibinong",
      city: "Bogor",
      postalCode: "16913",
      isActive: true,
      createdAt: "2025-01-16"
    },
    {
      id: 3,
      fullName: "Ahmad Rahman",
      email: "ahmad.rahman@email.com",
      address: "Jl. Anggrek No. 8",
      phoneNumber: "081234567892",
      identityCard: "3201234567890125",
      rtRw: "002/002",
      kelurahan: "Sukamaju",
      kecamatan: "Cibinong",
      city: "Bogor",
      postalCode: "16913",
      isActive: false,
      createdAt: "2025-01-17"
    },
    {
      id: 4,
      fullName: "Dewi Kartika",
      email: "dewi.kartika@email.com",
      address: "Jl. Dahlia No. 33",
      phoneNumber: "081234567893",
      identityCard: "3201234567890126",
      rtRw: "001/003",
      kelurahan: "Sukamaju",
      kecamatan: "Cibinong",
      city: "Bogor",
      postalCode: "16913",
      isActive: true,
      createdAt: "2025-01-18"
    },
    {
      id: 5,
      fullName: "Andi Wijaya",
      email: "andi.wijaya@email.com",
      address: "Jl. Kenanga No. 17",
      phoneNumber: "081234567894",
      identityCard: "3201234567890127",
      rtRw: "002/003",
      kelurahan: "Sukamaju",
      kecamatan: "Cibinong",
      city: "Bogor",
      postalCode: "16913",
      isActive: true,
      createdAt: "2025-01-19"
    }
  ])

  // Fetch residents data (simulated API call)
  const fetchResidents = async () => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      // In real app, this would be an API call
      console.log('Residents data loaded')
    } catch (error) {
      console.error('Error fetching residents:', error)
      toast.error('Gagal memuat data warga')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchResidents()
  }, [])

  const filteredAndSortedResidents = residents
    .filter(resident => {
      const matchesSearch = resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.identityCard.includes(searchTerm) ||
        resident.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterStatus === "all" || 
        (filterStatus === "active" && resident.isActive) ||
        (filterStatus === "inactive" && !resident.isActive)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Resident] as string
      const bValue = b[sortBy as keyof Resident] as string
      const comparison = aValue.localeCompare(bValue)
      return sortOrder === "asc" ? comparison : -comparison
    })

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedResidents.length / itemsPerPage)
  const paginatedResidents = filteredAndSortedResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Form validation
  const validateForm = (data: Resident): Partial<Resident> => {
    const newErrors: Partial<Resident> = {}
    
    if (!data.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi'
    if (!data.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Nomor HP wajib diisi'
    } else if (!/^\+?[0-9]{10,15}$/.test(data.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Format nomor HP tidak valid'
    }
    if (!data.identityCard.trim()) {
      newErrors.identityCard = 'Nomor KTP wajib diisi'
    } else if (!/^[0-9]{16}$/.test(data.identityCard)) {
      newErrors.identityCard = 'Nomor KTP harus 16 digit'
    }
    if (!data.address.trim()) newErrors.address = 'Alamat wajib diisi'
    if (!data.rtRw.trim()) newErrors.rtRw = 'RT/RW wajib diisi'
    if (!data.kelurahan.trim()) newErrors.kelurahan = 'Kelurahan wajib diisi'
    if (!data.kecamatan.trim()) newErrors.kecamatan = 'Kecamatan wajib diisi'
    if (!data.city.trim()) newErrors.city = 'Kota wajib diisi'
    if (!data.postalCode.trim()) {
      newErrors.postalCode = 'Kode pos wajib diisi'
    } else if (!/^[0-9]{5}$/.test(data.postalCode)) {
      newErrors.postalCode = 'Kode pos harus 5 digit'
    }
    
    return newErrors
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      identityCard: "",
      rtRw: "",
      kelurahan: "",
      kecamatan: "",
      city: "",
      postalCode: "",
      isActive: true
    })
    setErrors({})
    setEditingResident(null)
  }

  // Open dialog for new resident
  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Open dialog for editing resident
  const openEditDialog = (resident: Resident) => {
    setFormData(resident)
    setEditingResident(resident)
    setErrors({})
    setIsDialogOpen(true)
  }

  // Handle form submission (Create/Update)
  const handleSubmit = async () => {
    const validationErrors = validateForm(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Mohon perbaiki kesalahan pada form')
      return
    }

    setSubmitting(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingResident) {
        // Update existing resident
        setResidents(prev => prev.map(resident => 
          resident.id === editingResident.id 
            ? { ...formData, id: editingResident.id, createdAt: resident.createdAt }
            : resident
        ))
        toast.success('Data warga berhasil diperbarui')
      } else {
        // Create new resident
        const newResident: Resident = {
          ...formData,
          id: Math.max(...residents.map(r => r.id || 0)) + 1,
          createdAt: new Date().toISOString().split('T')[0]
        }
        setResidents(prev => [newResident, ...prev])
        toast.success('Warga baru berhasil ditambahkan')
      }
      
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving resident:', error)
      toast.error('Gagal menyimpan data warga')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete resident
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus warga ini?')) return
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setResidents(prev => prev.filter(resident => resident.id !== id))
      toast.success('Warga berhasil dihapus')
    } catch (error) {
      console.error('Error deleting resident:', error)
      toast.error('Gagal menghapus warga')
    }
  }

  // Toggle resident status
  const toggleStatus = async (id: number) => {
    try {
      setResidents(prev => prev.map(resident =>
        resident.id === id 
          ? { ...resident, isActive: !resident.isActive }
          : resident
      ))
      toast.success('Status warga berhasil diperbarui')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Gagal memperbarui status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Warga</h1>
          <p className="text-gray-600">Kelola data warga dan informasi pribadi mereka</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Tambah Warga Baru
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian & Filter</CardTitle>
          <CardDescription>Cari warga berdasarkan nama, email, KTP, atau alamat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari warga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Non-aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.length}</div>
            <p className="text-xs text-muted-foreground">Terdaftar dalam sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warga Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.filter(r => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Status aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warga Non-aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.filter(r => !r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Status non-aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hasil Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAndSortedResidents.length}</div>
            <p className="text-xs text-muted-foreground">Sesuai kriteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Residents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Warga</CardTitle>
          <CardDescription>Data lengkap warga yang terdaftar dalam sistem</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50" 
                    onClick={() => {
                      if (sortBy === 'fullName') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortBy('fullName')
                        setSortOrder('asc')
                      }
                    }}
                  >
                    Nama Lengkap <ArrowUpDown className="h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>RT/RW</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>No. HP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.fullName}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>{resident.rtRw}</TableCell>
                  <TableCell className="max-w-xs truncate">{resident.address}</TableCell>
                  <TableCell>{resident.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={resident.isActive ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(resident.id!)}
                    >
                      {resident.isActive ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Lihat detail"
                        onClick={() => {
                          toast.info(`Detail warga: ${resident.fullName}`)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Edit warga"
                        onClick={() => openEditDialog(resident)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        title="Hapus warga"
                        onClick={() => handleDelete(resident.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          )}
          
          {filteredAndSortedResidents.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada warga yang sesuai dengan kriteria pencarian.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">
                  Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedResidents.length)} dari {filteredAndSortedResidents.length} warga
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <span className="text-sm">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Resident Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResident ? 'Edit Warga' : 'Tambah Warga Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingResident ? 'Perbarui informasi warga yang sudah ada.' : 'Masukkan informasi lengkap warga baru.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Informasi Pribadi</h4>
              
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Masukkan nama lengkap"
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contoh@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Nomor HP *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="081234567890"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="identityCard">Nomor KTP *</Label>
                <Input
                  id="identityCard"
                  value={formData.identityCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, identityCard: e.target.value }))}
                  placeholder="16 digit nomor KTP"
                  maxLength={16}
                  className={errors.identityCard ? 'border-red-500' : ''}
                />
                {errors.identityCard && <p className="text-sm text-red-500">{errors.identityCard}</p>}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Informasi Alamat</h4>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Jl. Nama Jalan No. XX"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rtRw">RT/RW *</Label>
                  <Input
                    id="rtRw"
                    value={formData.rtRw}
                    onChange={(e) => setFormData(prev => ({ ...prev, rtRw: e.target.value }))}
                    placeholder="001/002"
                    className={errors.rtRw ? 'border-red-500' : ''}
                  />
                  {errors.rtRw && <p className="text-sm text-red-500">{errors.rtRw}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="kelurahan">Kelurahan *</Label>
                  <Input
                    id="kelurahan"
                    value={formData.kelurahan}
                    onChange={(e) => setFormData(prev => ({ ...prev, kelurahan: e.target.value }))}
                    placeholder="Nama kelurahan"
                    className={errors.kelurahan ? 'border-red-500' : ''}
                  />
                  {errors.kelurahan && <p className="text-sm text-red-500">{errors.kelurahan}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="kecamatan">Kecamatan *</Label>
                  <Input
                    id="kecamatan"
                    value={formData.kecamatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, kecamatan: e.target.value }))}
                    placeholder="Nama kecamatan"
                    className={errors.kecamatan ? 'border-red-500' : ''}
                  />
                  {errors.kecamatan && <p className="text-sm text-red-500">{errors.kecamatan}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">Kota *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Nama kota"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postalCode">Kode Pos *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="12345"
                  maxLength={5}
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Status</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Warga Aktif</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  {editingResident ? 'Perbarui' : 'Simpan'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}