"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Clock, ArrowLeft, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  firstName: string
  lastName: string
  company: string | null
  email: string
  lastInvoiceDate: string
  amount: number
  invoiceNumber?: string
  customerNumber: string
  totalInvoices: number
  totalAmount: number
}

const allCustomers: Customer[] = [
  {
    id: "CUST-001",
    firstName: "Max",
    lastName: "Müller",
    company: "Müller GmbH",
    email: "buchhaltung@mueller-gmbh.de",
    lastInvoiceDate: "2025-08-25T11:30:00",
    amount: 2450.8,
    invoiceNumber: "INV-2025-0847",
    customerNumber: "K-001",
    totalInvoices: 12,
    totalAmount: 28450.8,
  },
  {
    id: "CUST-002",
    firstName: "Peter",
    lastName: "Schmidt",
    company: "Schmidt & Partner",
    email: "finanzen@schmidt-partner.de",
    lastInvoiceDate: "2025-08-25T11:28:00",
    amount: 1890.5,
    invoiceNumber: "INV-2025-0848",
    customerNumber: "K-002",
    totalInvoices: 8,
    totalAmount: 15120.4,
  },
  {
    id: "CUST-003",
    firstName: "Anna",
    lastName: "Weber",
    company: "Weber Industries",
    email: "rechnungen@weber-ind.com",
    lastInvoiceDate: "2025-08-25T11:25:00",
    amount: 3200.0,
    invoiceNumber: "INV-2025-0849",
    customerNumber: "K-003",
    totalInvoices: 15,
    totalAmount: 48000.0,
  },
  {
    id: "CUST-004",
    firstName: "Thomas",
    lastName: "Fischer",
    company: "Fischer Consulting",
    email: "admin@fischer-consulting.de",
    lastInvoiceDate: "2025-08-25T11:22:00",
    amount: 1650.25,
    customerNumber: "K-004",
    totalInvoices: 6,
    totalAmount: 9901.5,
  },
  {
    id: "CUST-005",
    firstName: "Michael",
    lastName: "Bauer",
    company: "Bauer Logistik",
    email: "buchhaltung@bauer-logistik.de",
    lastInvoiceDate: "2025-08-25T11:20:00",
    amount: 4100.75,
    invoiceNumber: "INV-2025-0850",
    customerNumber: "K-005",
    totalInvoices: 20,
    totalAmount: 82015.0,
  },
  {
    id: "CUST-006",
    firstName: "Sarah",
    lastName: "Hoffmann",
    company: "Hoffmann Tech",
    email: "billing@hoffmann-tech.de",
    lastInvoiceDate: "2025-08-25T11:18:00",
    amount: 2750.3,
    invoiceNumber: "INV-2025-0851",
    customerNumber: "K-006",
    totalInvoices: 9,
    totalAmount: 24752.7,
  },
  {
    id: "CUST-007",
    firstName: "Julia",
    lastName: "Klein",
    company: "Klein & Associates",
    email: "finance@klein-associates.com",
    lastInvoiceDate: "2025-08-25T11:15:00",
    amount: 1200.0,
    invoiceNumber: "INV-2025-0852",
    customerNumber: "K-007",
    totalInvoices: 4,
    totalAmount: 4800.0,
  },
  {
    id: "CUST-008",
    firstName: "Hans",
    lastName: "Meier",
    company: null,
    email: "hans.meier@example.com",
    lastInvoiceDate: "2025-08-25T11:10:00",
    amount: 850.5,
    invoiceNumber: "INV-2025-0853",
    customerNumber: "K-008",
    totalInvoices: 3,
    totalAmount: 2551.5,
  },
]

export default function CustomersPage() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState({
    customerNumber: "",
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    lastInvoiceDate: "",
    amount: "",
    totalInvoices: "",
    totalAmount: "",
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-gray-600" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-gray-600" />
    )
  }

  const filteredAndSortedCustomers = allCustomers
    .filter((customer) => {
      const matchesCustomerNumber = filters.customerNumber === "" || customer.customerNumber.toLowerCase().includes(filters.customerNumber.toLowerCase())
      const matchesFirstName = filters.firstName === "" || customer.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      const matchesLastName = filters.lastName === "" || customer.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
      const matchesCompany = filters.company === "" || (customer.company && customer.company.toLowerCase().includes(filters.company.toLowerCase()))
      const matchesEmail = filters.email === "" || customer.email.toLowerCase().includes(filters.email.toLowerCase())
      const matchesLastInvoiceDate = filters.lastInvoiceDate === "" || formatDateTime(customer.lastInvoiceDate).includes(filters.lastInvoiceDate)
      const matchesAmount = filters.amount === "" || customer.amount.toString().includes(filters.amount)
      const matchesTotalInvoices = filters.totalInvoices === "" || customer.totalInvoices.toString().includes(filters.totalInvoices)
      const matchesTotalAmount = filters.totalAmount === "" || customer.totalAmount.toString().includes(filters.totalAmount)
      
      return (
        matchesCustomerNumber &&
        matchesFirstName &&
        matchesLastName &&
        matchesCompany &&
        matchesEmail &&
        matchesLastInvoiceDate &&
        matchesAmount &&
        matchesTotalInvoices &&
        matchesTotalAmount
      )
    })
    .sort((a, b) => {
      if (!sortColumn) return 0

      let aValue: any, bValue: any

      switch (sortColumn) {
        case "customerNumber":
          aValue = a.customerNumber
          bValue = b.customerNumber
          break
        case "firstName":
          aValue = a.firstName
          bValue = b.firstName
          break
        case "lastName":
          aValue = a.lastName
          bValue = b.lastName
          break
        case "company":
          aValue = a.company || ""
          bValue = b.company || ""
          break
        case "email":
          aValue = a.email
          bValue = b.email
          break
        case "lastInvoiceDate":
          aValue = new Date(a.lastInvoiceDate).getTime()
          bValue = new Date(b.lastInvoiceDate).getTime()
          break
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "totalInvoices":
          aValue = a.totalInvoices
          bValue = b.totalInvoices
          break
        case "totalAmount":
          aValue = a.totalAmount
          bValue = b.totalAmount
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

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

          <div className="grid gap-4 md:grid-cols-1 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
                <p className="text-sm text-gray-600">Gesamt Kunden</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Alle Kunden ({filteredAndSortedCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Kundennummer
                        <button onClick={() => handleSort("customerNumber")} className="ml-1">
                          {getSortIcon("customerNumber")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.customerNumber}
                        onChange={(e) => setFilters({ ...filters, customerNumber: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Vorname
                        <button onClick={() => handleSort("firstName")} className="ml-1">
                          {getSortIcon("firstName")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.firstName}
                        onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Name
                        <button onClick={() => handleSort("lastName")} className="ml-1">
                          {getSortIcon("lastName")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.lastName}
                        onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Firma
                        <button onClick={() => handleSort("company")} className="ml-1">
                          {getSortIcon("company")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.company}
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        E-Mail
                        <button onClick={() => handleSort("email")} className="ml-1">
                          {getSortIcon("email")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Letzte Rechnung
                        <button onClick={() => handleSort("lastInvoiceDate")} className="ml-1">
                          {getSortIcon("lastInvoiceDate")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.lastInvoiceDate}
                        onChange={(e) => setFilters({ ...filters, lastInvoiceDate: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Letzter Betrag
                        <button onClick={() => handleSort("amount")} className="ml-1">
                          {getSortIcon("amount")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.amount}
                        onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Gesamt Rechnungen
                        <button onClick={() => handleSort("totalInvoices")} className="ml-1">
                          {getSortIcon("totalInvoices")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.totalInvoices}
                        onChange={(e) => setFilters({ ...filters, totalInvoices: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">
                      <div className="flex items-center">
                        Gesamt Betrag
                        <button onClick={() => handleSort("totalAmount")} className="ml-1">
                          {getSortIcon("totalAmount")}
                        </button>
                      </div>
                      <Input
                        placeholder="Filter..."
                        value={filters.totalAmount}
                        onChange={(e) => setFilters({ ...filters, totalAmount: e.target.value })}
                        className="mt-2 h-8 text-sm"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-gray-200">
                      <TableCell className="font-medium text-gray-900">{customer.customerNumber}</TableCell>
                      <TableCell className="font-medium text-gray-900">{customer.firstName}</TableCell>
                      <TableCell className="font-medium text-gray-900">{customer.lastName}</TableCell>
                      <TableCell className="text-gray-700">{customer.company || "-"}</TableCell>
                      <TableCell className="text-gray-700">{customer.email}</TableCell>
                      <TableCell className="text-gray-900">{formatDateTime(customer.lastInvoiceDate)}</TableCell>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
