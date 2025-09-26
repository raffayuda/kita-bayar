"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  id?: string
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
  const router = useRouter()
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
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState<Resident | null>(null)
  
  // Data dari database
  const [residents, setResidents] = useState<Resident[]>([])

  // Fetch residents data dari API
  const fetchResidents = async () => {
    setLoading(true)
    try {
      console.log('🔄 Fetching residents from API...')
      const res = await fetch('/api/residents')
      console.log('📡 Response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.text()
        console.error('❌ API Error:', errorData)
        throw new Error(`API Error: ${res.status} ${errorData}`)
      }
      
      const data = await res.json()
      console.log('✅ Residents data received:', data)
      setResidents(data)
    } catch (error) {
      console.error('❌ Error fetching residents:', error)
      toast.error('Gagal memuat data warga: ' + (error instanceof Error ? error.message : 'Unknown error'))
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

  // Form validation - hanya fullName yang wajib
  const validateForm = (data: Resident): Partial<Resident> => {
    const newErrors: Partial<Resident> = {}
    
    if (!data.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi'
    
    // Optional validations - hanya jika diisi
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (data.phoneNumber && !/^\+?[0-9]{10,15}$/.test(data.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Format nomor HP tidak valid'
    }
    if (data.identityCard && !/^[0-9]{16}$/.test(data.identityCard)) {
      newErrors.identityCard = 'Nomor KTP harus 16 digit'
    }
    if (data.postalCode && !/^[0-9]{5}$/.test(data.postalCode)) {
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
        // Update existing resident via API
        console.log('🔄 Updating resident:', editingResident.id)
        const requestData = { ...formData, id: editingResident.id }
        console.log('📤 Update request data:', requestData)
        
        const res = await fetch('/api/residents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })
        
        console.log('📡 Update response status:', res.status)
        
        if (!res.ok) {
          const errorData = await res.text()
          console.error('❌ Update error:', errorData)
          throw new Error(`Gagal update data: ${res.status} ${errorData}`)
        }
        
        toast.success('Data warga berhasil diperbarui')
        fetchResidents()
      } else {
        // Create new resident via API
        console.log('🔄 Creating new resident...')
        console.log('📤 Request data:', formData)
        
        const res = await fetch('/api/residents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        console.log('📡 Create response status:', res.status)
        
        if (!res.ok) {
          const errorData = await res.text()
          console.error('❌ Create error:', errorData)
          throw new Error(`Gagal tambah data: ${res.status} ${errorData}`)
        }
        
        const responseData = await res.json()
        console.log('✅ Created resident:', responseData)
        
        toast.success('Warga baru berhasil ditambahkan')
        fetchResidents()
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

  // Open delete confirmation modal
  const openDeleteModal = (resident: Resident) => {
    setResidentToDelete(resident)
    setDeleteModalOpen(true)
  }

  // Delete resident
  const handleDelete = async () => {
    if (!residentToDelete) return
    
    try {
      const res = await fetch('/api/residents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: residentToDelete.id })
      })
      if (!res.ok) throw new Error('Gagal hapus data')
      toast.success('Warga berhasil dihapus')
      fetchResidents()
      setDeleteModalOpen(false)
      setResidentToDelete(null)
    } catch (error) {
      console.error('Error deleting resident:', error)
      toast.error('Gagal menghapus warga')
    }
  }

  // Toggle resident status
  const toggleStatus = async (id: string) => {
    try {
      const resident = residents.find(r => r.id === id)
      if (!resident) return
      const res = await fetch('/api/residents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resident, isActive: !resident.isActive, id })
      })
      if (!res.ok) throw new Error('Gagal update status')
      toast.success('Status warga berhasil diperbarui')
      fetchResidents()
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
                        onClick={() => router.push(`/admin/residents/${resident.id}`)}
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
                        onClick={() => openDeleteModal(resident)}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contoh@email.com (opsional)"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Nomor HP</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="081234567890 (opsional)"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="identityCard">Nomor KTP</Label>
                <Input
                  id="identityCard"
                  value={formData.identityCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, identityCard: e.target.value }))}
                  placeholder="16 digit nomor KTP (opsional)"
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
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Jl. Nama Jalan No. XX (opsional)"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rtRw">RT/RW</Label>
                  <Input
                    id="rtRw"
                    value={formData.rtRw}
                    onChange={(e) => setFormData(prev => ({ ...prev, rtRw: e.target.value }))}
                    placeholder="001/002 (opsional)"
                    className={errors.rtRw ? 'border-red-500' : ''}
                  />
                  {errors.rtRw && <p className="text-sm text-red-500">{errors.rtRw}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="kelurahan">Kelurahan</Label>
                  <Input
                    id="kelurahan"
                    value={formData.kelurahan}
                    onChange={(e) => setFormData(prev => ({ ...prev, kelurahan: e.target.value }))}
                    placeholder="Nama kelurahan (opsional)"
                    className={errors.kelurahan ? 'border-red-500' : ''}
                  />
                  {errors.kelurahan && <p className="text-sm text-red-500">{errors.kelurahan}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="kecamatan">Kecamatan</Label>
                  <Input
                    id="kecamatan"
                    value={formData.kecamatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, kecamatan: e.target.value }))}
                    placeholder="Nama kecamatan (opsional)"
                    className={errors.kecamatan ? 'border-red-500' : ''}
                  />
                  {errors.kecamatan && <p className="text-sm text-red-500">{errors.kecamatan}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Nama kota (opsional)"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="12345 (opsional)"
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Konfirmasi Hapus Warga
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus warga ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          {residentToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Nama:</span>
                  <span className="text-gray-900">{residentToDelete.fullName}</span>
                </div>
                {residentToDelete.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900">{residentToDelete.email}</span>
                  </div>
                )}
                {residentToDelete.identityCard && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">KTP:</span>
                    <span className="text-gray-900 font-mono">{residentToDelete.identityCard}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ <strong>Peringatan:</strong> Data warga yang dihapus tidak dapat dikembalikan. 
                  Pastikan Anda yakin sebelum melanjutkan.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteModalOpen(false)
                setResidentToDelete(null)
              }}
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Ya, Hapus Warga
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}