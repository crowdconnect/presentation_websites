"use client"

import Link from "next/link"
import { ArrowLeft, Eye, Play, AlertCircle, CheckCircle, Clock, RefreshCw, X, Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

// Mock data - würde normalerweise aus API kommen
const billingRuns = [
  {
    id: "RUN-2025-010",
    month: 10,
    year: 2025,
    status: "Bereit",
    customerCount: { completed: 0, total: 150 },
    period: { from: "2025-10-01", to: "2025-10-31" },
    totalBaseFee: 5250.0,
    totalTelephony: 320.0,
    totalAmount: 5570.0,
  },
  {
    id: "RUN-2025-009",
    month: 9,
    year: 2025,
    status: "Abgeschlossen",
    customerCount: { completed: 145, total: 145 },
    period: { from: "2025-09-01", to: "2025-09-30" },
    totalBaseFee: 5075.0,
    totalTelephony: 310.0,
    totalAmount: 5385.0,
  },
  {
    id: "RUN-2025-008",
    month: 8,
    year: 2025,
    status: "Abgeschlossen",
    customerCount: { completed: 142, total: 142 },
    period: { from: "2025-08-01", to: "2025-08-31" },
    totalBaseFee: 4970.0,
    totalTelephony: 295.0,
    totalAmount: 5265.0,
  },
]

const customers = [
  {
    id: "CUST-001",
    customerId: "K-001",
    name: "Max Mustermann",
    company: "ABC GmbH",
    connectionNumber: "1234567",
    baseFee: 35.0,
    telephony: 2.5,
    total: 37.5,
    status: "Erfolg",
    evnActive: true,
    evnAnonymous: false,
    invoicePerMail: true,
  },
  {
    id: "CUST-002",
    customerId: "K-002",
    name: "Eva Test",
    company: null,
    connectionNumber: "2345678",
    baseFee: 29.0,
    telephony: 0.0,
    total: 29.0,
    status: "Erfolg",
    evnActive: false,
    evnAnonymous: false,
    invoicePerMail: true,
  },
  {
    id: "CUST-003",
    customerId: "K-003",
    name: "Peter Schmidt",
    company: "Schmidt & Partner",
    connectionNumber: "3456789",
    baseFee: 45.0,
    telephony: 5.2,
    total: 50.2,
    status: "Warnung",
    evnActive: true,
    evnAnonymous: true,
    invoicePerMail: true,
  },
  {
    id: "CUST-004",
    customerId: "K-004",
    name: "Anna Weber",
    company: null,
    connectionNumber: null,
    baseFee: 0.0,
    telephony: 0.0,
    total: 0.0,
    status: "Keine Daten",
    evnActive: false,
    evnAnonymous: false,
    invoicePerMail: false,
  },
  {
    id: "CUST-005",
    customerId: "K-005",
    name: "Thomas Fischer",
    company: "Fischer Consulting",
    connectionNumber: "4567890",
    baseFee: 55.0,
    telephony: 8.5,
    total: 63.5,
    status: "Fehler",
    evnActive: true,
    evnAnonymous: false,
    invoicePerMail: true,
  },
]

const months = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

function getStatusColor(status: string) {
  switch (status) {
    case "Abgeschlossen":
    case "Erfolgreich":
    case "Erfolg":
      return "bg-green-100 text-green-800"
    case "Fehler":
    case "Abgebrochen":
      return "bg-red-100 text-red-800"
    case "Erstellung":
    case "Verarbeitung":
      return "bg-yellow-100 text-yellow-800"
    case "Bereit":
      return "bg-blue-100 text-blue-800"
    case "Wartend":
      return "bg-gray-100 text-gray-800"
    case "Warnung":
      return "bg-orange-100 text-orange-800"
    case "Keine Daten":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Abgeschlossen":
    case "Erfolgreich":
    case "Erfolg":
      return <CheckCircle className="w-4 h-4" />
    case "Fehler":
    case "Abgebrochen":
      return <AlertCircle className="w-4 h-4" />
    case "Erstellung":
    case "Verarbeitung":
      return <RefreshCw className="w-4 h-4 animate-spin" />
    case "Bereit":
      return <Play className="w-4 h-4" />
    case "Wartend":
    case "Keine Daten":
      return <Clock className="w-4 h-4" />
    case "Warnung":
      return <AlertCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function BillingOverviewPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [billingRunExists, setBillingRunExists] = useState<boolean>(false)
  
  // Filter und Sortierung für Kundentabelle
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState({
    customerId: "",
    name: "",
    company: "",
    connectionNumber: "",
    baseFee: "",
    telephony: "",
    total: "",
    status: "all",
    evnActive: "all",
    evnAnonymous: "all",
    invoicePerMail: "all",
  })

  const handleMonthYearChange = () => {
    // Prüfe ob Rechnungslauf für ausgewählten Monat existiert
    const exists = billingRuns.some(
      (run) => run.month === selectedMonth && run.year === selectedYear
    )
    setBillingRunExists(exists)
  }

  const handleCreateBillingRun = () => {
    // Validierung: Nur im Folgemonat möglich
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    if (selectedMonth === null) {
      alert("Bitte wählen Sie einen Monat aus")
      return
    }

    if (selectedMonth === currentMonth && selectedYear === currentYear) {
      alert("Rechnungslauf kann nur im Folgemonat erstellt werden")
      return
    }

    if (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth > currentMonth)) {
      alert("Rechnungslauf kann nur für vergangene Monate erstellt werden")
      return
    }

    // Hier würde API-Call erfolgen
    alert(`Rechnungslauf für ${months[selectedMonth - 1]} ${selectedYear} wird erstellt...`)
  }

  // Filter- und Sortier-Logik für Kundentabelle
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

  const filteredAndSortedCustomers = customers
    .filter((customer) => {
      const matchesCustomerId = filters.customerId === "" || customer.customerId.toLowerCase().includes(filters.customerId.toLowerCase())
      const matchesName = filters.name === "" || customer.name.toLowerCase().includes(filters.name.toLowerCase())
      const matchesCompany = filters.company === "" || (customer.company && customer.company.toLowerCase().includes(filters.company.toLowerCase()))
      const matchesConnection = filters.connectionNumber === "" || (customer.connectionNumber && customer.connectionNumber.includes(filters.connectionNumber))
      const matchesBaseFee = filters.baseFee === "" || customer.baseFee.toString().includes(filters.baseFee)
      const matchesTelephony = filters.telephony === "" || customer.telephony.toString().includes(filters.telephony)
      const matchesTotal = filters.total === "" || customer.total.toString().includes(filters.total)
      const matchesStatus = filters.status === "all" || customer.status === filters.status
      const matchesEvnActive = filters.evnActive === "all" || (filters.evnActive === "yes" && customer.evnActive) || (filters.evnActive === "no" && !customer.evnActive)
      const matchesEvnAnonymous = filters.evnAnonymous === "all" || (filters.evnAnonymous === "yes" && customer.evnAnonymous) || (filters.evnAnonymous === "no" && !customer.evnAnonymous)
      const matchesInvoicePerMail = filters.invoicePerMail === "all" || (filters.invoicePerMail === "yes" && customer.invoicePerMail) || (filters.invoicePerMail === "no" && !customer.invoicePerMail)
      
      return (
        matchesCustomerId &&
        matchesName &&
        matchesCompany &&
        matchesConnection &&
        matchesBaseFee &&
        matchesTelephony &&
        matchesTotal &&
        matchesStatus &&
        matchesEvnActive &&
        matchesEvnAnonymous &&
        matchesInvoicePerMail
      )
    })
    .sort((a, b) => {
      if (!sortColumn) return 0

      let aValue: any, bValue: any

      switch (sortColumn) {
        case "customerId":
          aValue = a.customerId
          bValue = b.customerId
          break
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "company":
          aValue = a.company || ""
          bValue = b.company || ""
          break
        case "connectionNumber":
          aValue = a.connectionNumber || ""
          bValue = b.connectionNumber || ""
          break
        case "baseFee":
          aValue = a.baseFee
          bValue = b.baseFee
          break
        case "telephony":
          aValue = a.telephony
          bValue = b.telephony
          break
        case "total":
          aValue = a.total
          bValue = b.total
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "evnActive":
          aValue = a.evnActive ? 1 : 0
          bValue = b.evnActive ? 1 : 0
          break
        case "evnAnonymous":
          aValue = a.evnAnonymous ? 1 : 0
          bValue = b.evnAnonymous ? 1 : 0
          break
        case "invoicePerMail":
          aValue = a.invoicePerMail ? 1 : 0
          bValue = b.invoicePerMail ? 1 : 0
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

  // Berechne Statistiken
  const totalCustomers = billingRuns.reduce((sum, run) => sum + run.customerCount.total, 0)
  const successfulCustomers = billingRuns.reduce((sum, run) => sum + run.customerCount.completed, 0)
  const errorCustomers = customers.filter((c) => c.status === "Fehler").length
  const totalBaseFee = billingRuns.reduce((sum, run) => sum + run.totalBaseFee, 0)
  const totalTelephony = billingRuns.reduce((sum, run) => sum + run.totalTelephony, 0)
  const totalAmount = billingRuns.reduce((sum, run) => sum + run.totalAmount, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#274366" }}>
      <div className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/mawacon-logo.png"
                alt="mawacon"
                width={120}
                height={32}
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
          </div>
          <div className="text-gray-700 text-sm font-medium">EW</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>

        {/* Rechnungslauf-Erstellung */}
        <Card className="mb-6 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Rechnungslauf erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Monat</label>
                <Select
                  value={selectedMonth?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedMonth(parseInt(value))
                    handleMonthYearChange()
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    <SelectValue placeholder="Monat auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Jahr</label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => {
                    setSelectedYear(parseInt(value))
                    handleMonthYearChange()
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreateBillingRun}
                disabled={selectedMonth === null}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Rechnungslauf erstellen
              </Button>
            </div>
            {selectedMonth && (
              <Alert className="mt-4">
                <AlertDescription>
                  {billingRunExists ? (
                    <span className="text-green-600">
                      ✓ Rechnungslauf vorhanden für {months[selectedMonth - 1]} {selectedYear}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Kein Rechnungslauf für {months[selectedMonth - 1]} {selectedYear}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Statistik-Karten */}
        {billingRuns.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Gesamt Kunden</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Erfolgreich</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{successfulCustomers}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Fehler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{errorCustomers}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Grundgebühr gesamt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalBaseFee)}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Telefonie gesamt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalTelephony)}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Gesamtbetrag</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Rechnungslauf-Tabelle */}
            <Card className="mb-6 bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Rechnungsläufe</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Monat/Jahr</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Kunden</TableHead>
                      <TableHead className="text-gray-700">Zeitraum</TableHead>
                      <TableHead className="text-gray-700">Grundgebühr</TableHead>
                      <TableHead className="text-gray-700">Telefonie</TableHead>
                      <TableHead className="text-gray-700">Gesamt</TableHead>
                      <TableHead className="text-gray-700">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingRuns.map((run) => (
                      <TableRow key={run.id} className="border-gray-200">
                        <TableCell className="font-medium text-gray-900">
                          {months[run.month - 1]} {run.year}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(run.status)}>
                            {getStatusIcon(run.status)}
                            <span className="ml-1">{run.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {run.customerCount.completed}/{run.customerCount.total}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {formatDate(run.period.from)} - {formatDate(run.period.to)}
                        </TableCell>
                        <TableCell className="text-gray-900">{formatCurrency(run.totalBaseFee)}</TableCell>
                        <TableCell className="text-gray-900">{formatCurrency(run.totalTelephony)}</TableCell>
                        <TableCell className="font-medium text-gray-900">{formatCurrency(run.totalAmount)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/billing-run/${run.id}`}>
                              <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                                Details
                              </Button>
                            </Link>
                            {run.status === "Bereit" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Play className="w-4 h-4 mr-1" />
                                Starten
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Kundentabelle */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Kunden Rechnungsübersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Kunden-ID
                            <button onClick={() => handleSort("customerId")} className="ml-1">
                              {getSortIcon("customerId")}
                            </button>
                          </div>
                          <Input
                            placeholder="Filter..."
                            value={filters.customerId}
                            onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
                            className="mt-2 h-8 text-sm"
                          />
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Name
                            <button onClick={() => handleSort("name")} className="ml-1">
                              {getSortIcon("name")}
                            </button>
                          </div>
                          <Input
                            placeholder="Filter..."
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
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
                            Anschluss
                            <button onClick={() => handleSort("connectionNumber")} className="ml-1">
                              {getSortIcon("connectionNumber")}
                            </button>
                          </div>
                          <Input
                            placeholder="Filter..."
                            value={filters.connectionNumber}
                            onChange={(e) => setFilters({ ...filters, connectionNumber: e.target.value })}
                            className="mt-2 h-8 text-sm"
                          />
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Grundgebühr
                            <button onClick={() => handleSort("baseFee")} className="ml-1">
                              {getSortIcon("baseFee")}
                            </button>
                          </div>
                          <Input
                            placeholder="Filter..."
                            value={filters.baseFee}
                            onChange={(e) => setFilters({ ...filters, baseFee: e.target.value })}
                            className="mt-2 h-8 text-sm"
                          />
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Telefonie
                            <button onClick={() => handleSort("telephony")} className="ml-1">
                              {getSortIcon("telephony")}
                            </button>
                          </div>
                          <Input
                            placeholder="Filter..."
                            value={filters.telephony}
                            onChange={(e) => setFilters({ ...filters, telephony: e.target.value })}
                            className="mt-2 h-8 text-sm"
                          />
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Gesamt
                            <button onClick={() => handleSort("total")} className="ml-1">
                              {getSortIcon("total")}
                            </button>
                          </div>
                          <Input
                            placeholder="Filter..."
                            value={filters.total}
                            onChange={(e) => setFilters({ ...filters, total: e.target.value })}
                            className="mt-2 h-8 text-sm"
                          />
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Status
                            <button onClick={() => handleSort("status")} className="ml-1">
                              {getSortIcon("status")}
                            </button>
                          </div>
                          <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                          >
                            <SelectTrigger className="mt-2 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Alle</SelectItem>
                              <SelectItem value="Erfolg">Erfolg</SelectItem>
                              <SelectItem value="Warnung">Warnung</SelectItem>
                              <SelectItem value="Fehler">Fehler</SelectItem>
                              <SelectItem value="Keine Daten">Keine Daten</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            EVN
                            <button onClick={() => handleSort("evnActive")} className="ml-1">
                              {getSortIcon("evnActive")}
                            </button>
                          </div>
                          <Select
                            value={filters.evnActive}
                            onValueChange={(value) => setFilters({ ...filters, evnActive: value })}
                          >
                            <SelectTrigger className="mt-2 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Alle</SelectItem>
                              <SelectItem value="yes">Ja</SelectItem>
                              <SelectItem value="no">Nein</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            EVN anonym
                            <button onClick={() => handleSort("evnAnonymous")} className="ml-1">
                              {getSortIcon("evnAnonymous")}
                            </button>
                          </div>
                          <Select
                            value={filters.evnAnonymous}
                            onValueChange={(value) => setFilters({ ...filters, evnAnonymous: value })}
                          >
                            <SelectTrigger className="mt-2 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Alle</SelectItem>
                              <SelectItem value="yes">Ja</SelectItem>
                              <SelectItem value="no">Nein</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="text-gray-700">
                          <div className="flex items-center">
                            Rechnung per Post
                            <button onClick={() => handleSort("invoicePerMail")} className="ml-1">
                              {getSortIcon("invoicePerMail")}
                            </button>
                          </div>
                          <Select
                            value={filters.invoicePerMail}
                            onValueChange={(value) => setFilters({ ...filters, invoicePerMail: value })}
                          >
                            <SelectTrigger className="mt-2 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Alle</SelectItem>
                              <SelectItem value="yes">Ja</SelectItem>
                              <SelectItem value="no">Nein</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="text-gray-700">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedCustomers.map((customer) => (
                        <TableRow key={customer.id} className="border-gray-200">
                          <TableCell className="font-medium text-gray-900">{customer.customerId}</TableCell>
                          <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                          <TableCell className="text-gray-900">{customer.company || "-"}</TableCell>
                          <TableCell className="text-gray-900">{customer.connectionNumber || "-"}</TableCell>
                          <TableCell className="text-gray-900">{formatCurrency(customer.baseFee)}</TableCell>
                          <TableCell className="text-gray-900">{formatCurrency(customer.telephony)}</TableCell>
                          <TableCell className="font-medium text-gray-900">{formatCurrency(customer.total)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(customer.status)}>
                              {getStatusIcon(customer.status)}
                              <span className="ml-1">{customer.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-900">{customer.evnActive ? "✓" : "✗"}</TableCell>
                          <TableCell className="text-gray-900">{customer.evnAnonymous ? "✓" : "✗"}</TableCell>
                          <TableCell className="text-gray-900">{customer.invoicePerMail ? "✓" : "✗"}</TableCell>
                          <TableCell>
                            <Link href={`/customer/${customer.id}`}>
                              <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                                Details
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
          </>
        )}
      </div>
    </div>
  )
}
