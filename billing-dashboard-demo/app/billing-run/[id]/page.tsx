"use client"

import Link from "next/link"
import { ArrowLeft, Play, Download, AlertTriangle, CheckCircle, Clock, XCircle, Search, DollarSign, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"

const billingRunDetails = {
  id: "RUN-2025-001",
  date: "26.08.2025",
  time: "14:30",
  status: "Bereit",
  totalCustomers: 1247,
  completedInvoices: 1247,
  errorCount: 3,
  revenue: 125450.75, // Einnahmen
  duration: "23 Minuten",
  startedBy: "Max Mustermann",
}

// Mock data - würde normalerweise aus API kommen
const generateCustomers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `CUST-${String(i + 1).padStart(3, "0")}`,
    customerId: `K-${String(i + 1).padStart(3, "0")}`,
    name: `Kunde ${i + 1}`,
    company: i % 3 === 0 ? `Firma ${i + 1} GmbH` : null,
    connectionNumber: i % 10 === 0 ? null : `123456${i}`,
    baseFee: 29.0 + (i % 5) * 10,
    telephony: (i % 3) * 2.5,
    total: 29.0 + (i % 5) * 10 + (i % 3) * 2.5,
    status: i % 20 === 0 ? "Fehler" : i % 15 === 0 ? "Warnung" : "Erfolg",
    evnActive: i % 2 === 0,
    evnAnonymous: i % 4 === 0,
    invoicePerMail: true,
  }))
}

const errorLog = [
  {
    id: 1,
    customer: "Firma ABC GmbH",
    message: "Ungültige Rechnungsadresse",
    timestamp: "2025-08-26T14:32:00",
    level: "ERROR",
  },
  {
    id: 2,
    customer: "Mustermann KG",
    message: "Fehlende Steuernummer",
    timestamp: "2025-08-26T14:35:00",
    level: "WARNING",
  },
  {
    id: 3,
    customer: "Test Solutions",
    message: "Verbindungsfehler zur Datenbank",
    timestamp: "2025-08-26T14:38:00",
    level: "ERROR",
  },
  {
    id: 4,
    customer: "Weber Industries",
    message: "Tarif-Abweichung erkannt",
    timestamp: "2025-08-26T14:40:00",
    level: "WARNING",
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function BillingRunDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [errorSortBy, setErrorSortBy] = useState<"timestamp" | "level" | "customer">("timestamp")
  const [errorSortOrder, setErrorSortOrder] = useState<"asc" | "desc">("desc")
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const pageSize = 50

  const loadCustomers = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return
    setLoading(true)
    
    // Simuliere API-Call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newCustomers = generateCustomers(pageSize)
    
    if (pageNum === 1) {
      setCustomers(newCustomers)
    } else {
      setCustomers((prev) => [...prev, ...newCustomers])
    }
    
    setHasMore(pageNum * pageSize < billingRunDetails.totalCustomers)
    setLoading(false)
  }, [loading, hasMore])

  useEffect(() => {
    loadCustomers(1)
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      setPage((prev) => {
        const nextPage = prev + 1
        loadCustomers(nextPage)
        return nextPage
      })
    }
  }, [hasMore, loading, loadCustomers])

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

  const filteredCustomers = customers
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

  const sortedErrors = [...errorLog].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (errorSortBy) {
      case "timestamp":
        aValue = new Date(a.timestamp).getTime()
        bValue = new Date(b.timestamp).getTime()
        break
      case "level":
        aValue = a.level
        bValue = b.level
        break
      case "customer":
        aValue = a.customer
        bValue = b.customer
        break
    }
    
    if (errorSortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const canStartBillingRun = billingRunDetails.status === "Bereit"

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
        <div className="mb-6">
          <Link href="/billing-overview">
            <Button variant="ghost" className="mb-4 text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Rechnungslauf {id}</h1>
              <p className="text-white/80">
                {billingRunDetails.date} um {billingRunDetails.time}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              {canStartBillingRun && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Starten
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{billingRunDetails.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Dauer</p>
                  <p className="font-semibold">{billingRunDetails.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Erfolgreich</p>
                  <p className="font-semibold">{billingRunDetails.completedInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Fehler</p>
                  <p className="font-semibold text-red-600">{billingRunDetails.errorCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Einnahmen</p>
                  <p className="font-semibold text-green-600">{formatCurrency(billingRunDetails.revenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fortschritt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Rechnungen erstellt</span>
                  <span>
                    {billingRunDetails.completedInvoices} / {billingRunDetails.totalCustomers}
                  </span>
                </div>
                <Progress value={(billingRunDetails.completedInvoices / billingRunDetails.totalCustomers) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Details */}
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger
              value="invoices"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              Rechnungsübersicht
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              Fehlerprotokoll
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Rechnungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <ScrollArea
                    ref={scrollAreaRef}
                    onScroll={handleScroll}
                    className="h-[600px]"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                              </SelectContent>
                            </Select>
                          </TableHead>
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>
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
                          <TableHead>Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.customerId}</TableCell>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.company || "-"}</TableCell>
                            <TableCell>{customer.connectionNumber || "-"}</TableCell>
                            <TableCell>{formatCurrency(customer.baseFee)}</TableCell>
                            <TableCell>{formatCurrency(customer.telephony)}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(customer.total)}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  customer.status === "Erfolg"
                                    ? "bg-green-100 text-green-800"
                                    : customer.status === "Fehler"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-orange-100 text-orange-800"
                                }
                              >
                                {customer.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{customer.evnActive ? "✓" : "✗"}</TableCell>
                            <TableCell>{customer.evnAnonymous ? "✓" : "✗"}</TableCell>
                            <TableCell>{customer.invoicePerMail ? "✓" : "✗"}</TableCell>
                            <TableCell>
                              <Link href={`/customer/${customer.id}`}>
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                        {loading && (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center text-gray-500">
                              Lädt...
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Fehlerprotokoll ({errorLog.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={errorSortBy} onValueChange={(v: any) => setErrorSortBy(v)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timestamp">Zeitstempel</SelectItem>
                        <SelectItem value="level">Level</SelectItem>
                        <SelectItem value="customer">Kunde</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setErrorSortOrder(errorSortOrder === "asc" ? "desc" : "asc")}
                    >
                      <ArrowUpDown className="w-4 h-4 mr-1" />
                      {errorSortOrder === "asc" ? "Aufsteigend" : "Absteigend"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zeitstempel</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Nachricht</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedErrors.map((error) => (
                      <TableRow key={error.id}>
                        <TableCell className="font-mono text-sm">{formatDateTime(error.timestamp)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={error.level === "ERROR" ? "destructive" : "secondary"}
                            className={error.level === "WARNING" ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {error.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{error.customer}</TableCell>
                        <TableCell>{error.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
