"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Clock, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Customer {
  id: string
  name: string
  email: string
  lastInvoiceDate: string
  status: "delivered" | "failed" | "pending"
  amount: number
  invoiceNumber?: string
  customerNumber: string
  totalInvoices: number
  totalAmount: number
}

const allCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Müller GmbH",
    email: "buchhaltung@mueller-gmbh.de",
    lastInvoiceDate: "2025-08-25T11:30:00",
    status: "delivered",
    amount: 2450.8,
    invoiceNumber: "INV-2025-0847",
    customerNumber: "K-001",
    totalInvoices: 12,
    totalAmount: 28450.8,
  },
  {
    id: "CUST-002",
    name: "Schmidt & Partner",
    email: "finanzen@schmidt-partner.de",
    lastInvoiceDate: "2025-08-25T11:28:00",
    status: "failed",
    amount: 1890.5,
    invoiceNumber: "INV-2025-0848",
    customerNumber: "K-002",
    totalInvoices: 8,
    totalAmount: 15120.4,
  },
  {
    id: "CUST-003",
    name: "Weber Industries",
    email: "rechnungen@weber-ind.com",
    lastInvoiceDate: "2025-08-25T11:25:00",
    status: "delivered",
    amount: 3200.0,
    invoiceNumber: "INV-2025-0849",
    customerNumber: "K-003",
    totalInvoices: 15,
    totalAmount: 48000.0,
  },
  {
    id: "CUST-004",
    name: "Fischer Consulting",
    email: "admin@fischer-consulting.de",
    lastInvoiceDate: "2025-08-25T11:22:00",
    status: "pending",
    amount: 1650.25,
    customerNumber: "K-004",
    totalInvoices: 6,
    totalAmount: 9901.5,
  },
  {
    id: "CUST-005",
    name: "Bauer Logistik",
    email: "buchhaltung@bauer-logistik.de",
    lastInvoiceDate: "2025-08-25T11:20:00",
    status: "delivered",
    amount: 4100.75,
    invoiceNumber: "INV-2025-0850",
    customerNumber: "K-005",
    totalInvoices: 20,
    totalAmount: 82015.0,
  },
  // Additional customers for demonstration
  {
    id: "CUST-006",
    name: "Hoffmann Tech",
    email: "billing@hoffmann-tech.de",
    lastInvoiceDate: "2025-08-25T11:18:00",
    status: "delivered",
    amount: 2750.3,
    invoiceNumber: "INV-2025-0851",
    customerNumber: "K-006",
    totalInvoices: 9,
    totalAmount: 24752.7,
  },
  {
    id: "CUST-007",
    name: "Klein & Associates",
    email: "finance@klein-associates.com",
    lastInvoiceDate: "2025-08-25T11:15:00",
    status: "failed",
    amount: 1200.0,
    invoiceNumber: "INV-2025-0852",
    customerNumber: "K-007",
    totalInvoices: 4,
    totalAmount: 4800.0,
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-chart-3" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
            Zugestellt
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Fehler</Badge>
      case "pending":
        return <Badge variant="outline">Wartend</Badge>
      default:
        return null
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const totalCustomers = allCustomers.length
  const deliveredCount = allCustomers.filter((c) => c.status === "delivered").length
  const failedCount = allCustomers.filter((c) => c.status === "failed").length
  const pendingCount = allCustomers.filter((c) => c.status === "pending").length

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#274366" }}>
      <div className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/mawacon-logo.png" alt="mawacon" className="h-8 w-auto cursor-pointer" />
            </Link>
          </div>
          <div className="text-gray-700 text-sm font-medium">EW</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/billing-overview">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Kunden Rechnungsübersicht</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
                <p className="text-sm text-gray-600">Gesamt Kunden</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{deliveredCount}</div>
                <p className="text-sm text-gray-600">Zugestellt</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <p className="text-sm text-gray-600">Fehler</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">{pendingCount}</div>
                <p className="text-sm text-gray-600">Wartend</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Kunde, E-Mail oder Kundennummer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-md text-sm"
            >
              <option value="all" className="text-black">
                Alle Status
              </option>
              <option value="delivered" className="text-black">
                Zugestellt
              </option>
              <option value="failed" className="text-black">
                Fehler
              </option>
              <option value="pending" className="text-black">
                Wartend
              </option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Alle Kunden ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700">Kundennummer</TableHead>
                  <TableHead className="text-gray-700">Kunde</TableHead>
                  <TableHead className="text-gray-700">E-Mail</TableHead>
                  <TableHead className="text-gray-700">Letzte Rechnung</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Letzter Betrag</TableHead>
                  <TableHead className="text-gray-700">Gesamt Rechnungen</TableHead>
                  <TableHead className="text-gray-700">Gesamt Betrag</TableHead>
                  <TableHead className="text-gray-700">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">{customer.customerNumber}</TableCell>
                    <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                    <TableCell className="text-gray-700">{customer.email}</TableCell>
                    <TableCell className="text-gray-900">{formatDateTime(customer.lastInvoiceDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(customer.status)}
                        {getStatusBadge(customer.status)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{formatCurrency(customer.amount)}</TableCell>
                    <TableCell className="text-gray-900">{customer.totalInvoices}</TableCell>
                    <TableCell className="font-medium text-gray-900">{formatCurrency(customer.totalAmount)}</TableCell>
                    <TableCell>
                      <Link href={`/customer/${customer.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Ansehen
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
