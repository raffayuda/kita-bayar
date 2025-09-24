"use client"

import { useState } from "react"
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
  const [residents, setResidents] = useState([
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
  ]

  const filteredResidents = residents.filter(resident =>
    resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.identityCard.includes(searchTerm) ||
    resident.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Warga</h1>
          <p className="text-gray-600">Kelola data warga dan informasi pribadi mereka</p>
        </div>
        <Button className="flex items-center gap-2">
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
            <Button variant="outline">Filter</Button>
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
            <div className="text-2xl font-bold">{filteredResidents.length}</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>RT/RW</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.fullName}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>{resident.rtRw}</TableCell>
                  <TableCell className="max-w-xs truncate">{resident.address}</TableCell>
                  <TableCell>{resident.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge variant={resident.isActive ? "default" : "secondary"}>
                      {resident.isActive ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredResidents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada warga yang sesuai dengan kriteria pencarian.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}