"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, Clock, ArrowLeft, FileText, AlertTriangle, Download, Eye, Plus, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Database, FileCheck, UserPlus, UserMinus, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

interface Invoice {
  id: string
  invoiceNumber: string
  type: "Normal" | "Storno" | "Ergänzend"
  period: { from: string; to: string }
  baseFee: number
  telephony: number
  total: number
  date: string
  amount: number
  status: "delivered" | "failed" | "pending"
  dueDate: string
  description: string
  createdAt: string
}

interface ErrorLog {
  id: string
  timestamp: string
  type: "error" | "warning" | "info"
  message: string
  details?: string
}

interface ActivityLog {
  id: string
  timestamp: string
  action: "create" | "update" | "delete" | "database_query" | "file_generation" | "invoice_created" | "invoice_sent"
  category: "customer" | "invoice" | "database" | "file" | "system"
  description: string
  duration?: number // in milliseconds
  status: "success" | "error" | "warning"
  details?: string
  user?: string
  target?: string // e.g., "INV-2025-0847", "Rechnungsdaten", "Telefoniedaten"
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  customerNumber: string
  address: string
  phone: string
  totalInvoices: number
  totalAmount: number
  lastInvoiceDate: string
}

const mockCustomerDetails: Record<string, CustomerDetail> = {
  "CUST-001": {
    id: "CUST-001",
    name: "Müller GmbH",
    email: "buchhaltung@mueller-gmbh.de",
    customerNumber: "K-001",
    address: "Hauptstraße 123, 10115 Berlin",
    phone: "+49 30 12345678",
    totalInvoices: 12,
    totalAmount: 28450.8,
    lastInvoiceDate: "2025-08-25T11:30:00",
  },
  "CUST-002": {
    id: "CUST-002",
    name: "Schmidt & Partner",
    email: "finanzen@schmidt-partner.de",
    customerNumber: "K-002",
    address: "Geschäftsstraße 45, 20095 Hamburg",
    phone: "+49 40 98765432",
    totalInvoices: 8,
    totalAmount: 15120.4,
    lastInvoiceDate: "2025-08-25T11:28:00",
  },
}

const mockActivityLogs: Record<string, ActivityLog[]> = {
  "CUST-001": [
    {
      id: "LOG-001",
      timestamp: "2025-08-26T14:45:00",
      action: "database_query",
      category: "database",
      description: "Abfrage Rechnungsdaten",
      duration: 234,
      status: "success",
      target: "Rechnungsdaten",
    },
    {
      id: "LOG-002",
      timestamp: "2025-08-26T14:45:12",
      action: "database_query",
      category: "database",
      description: "Abfrage Telefoniedaten",
      duration: 456,
      status: "success",
      target: "Telefoniedaten",
    },
    {
      id: "LOG-003",
      timestamp: "2025-08-26T14:45:30",
      action: "file_generation",
      category: "file",
      description: "PDF-Rechnung generiert",
      duration: 1234,
      status: "success",
      target: "INV-2025-0847",
    },
    {
      id: "LOG-004",
      timestamp: "2025-08-26T14:45:45",
      action: "file_generation",
      category: "file",
      description: "EVN-PDF generiert",
      duration: 892,
      status: "success",
      target: "INV-2025-0847",
    },
    {
      id: "LOG-005",
      timestamp: "2025-08-26T14:46:00",
      action: "invoice_sent",
      category: "invoice",
      description: "Rechnung per E-Mail versendet",
      duration: 567,
      status: "success",
      target: "INV-2025-0847",
    },
    {
      id: "LOG-006",
      timestamp: "2025-08-25T10:30:00",
      action: "update",
      category: "customer",
      description: "Kundendaten aktualisiert",
      status: "success",
      user: "Max Mustermann",
      details: "E-Mail-Adresse geändert",
    },
    {
      id: "LOG-007",
      timestamp: "2025-08-20T09:15:00",
      action: "database_query",
      category: "database",
      description: "Abfrage Rechnungsdaten",
      duration: 189,
      status: "success",
      target: "Rechnungsdaten",
    },
    {
      id: "LOG-008",
      timestamp: "2025-08-20T09:15:15",
      action: "database_query",
      category: "database",
      description: "Abfrage Telefoniedaten",
      duration: 523,
      status: "warning",
      target: "Telefoniedaten",
      details: "Langsame Antwortzeit",
    },
    {
      id: "LOG-009",
      timestamp: "2025-08-20T09:16:00",
      action: "file_generation",
      category: "file",
      description: "PDF-Rechnung generiert",
      duration: 1456,
      status: "success",
      target: "INV-2025-0723",
    },
    {
      id: "LOG-010",
      timestamp: "2025-07-15T11:00:00",
      action: "create",
      category: "customer",
      description: "Kunde angelegt",
      status: "success",
      user: "System",
    },
    {
      id: "LOG-011",
      timestamp: "2025-07-15T11:05:00",
      action: "update",
      category: "customer",
      description: "Tarifinformationen aktualisiert",
      status: "success",
      user: "Anna Weber",
      details: "Tarif geändert von Basic zu Premium",
    },
    {
      id: "LOG-012",
      timestamp: "2025-08-26T15:00:00",
      action: "invoice_created",
      category: "invoice",
      description: "Individuelle Rechnung erstellt",
      status: "success",
      user: "Max Mustermann",
      target: "RG-IND-2025-001",
    },
  ],
  "CUST-002": [
    {
      id: "LOG-013",
      timestamp: "2025-08-25T11:28:00",
      action: "database_query",
      category: "database",
      description: "Abfrage Rechnungsdaten",
      duration: 312,
      status: "success",
      target: "Rechnungsdaten",
    },
    {
      id: "LOG-014",
      timestamp: "2025-08-25T11:28:20",
      action: "file_generation",
      category: "file",
      description: "PDF-Rechnung generiert",
      duration: 987,
      status: "error",
      target: "INV-2025-0848",
      details: "Template nicht gefunden",
    },
  ],
}

const mockInvoices: Record<string, Invoice[]> = {
  "CUST-001": [
    {
      id: "INV-001",
      invoiceNumber: "INV-2025-0847",
      type: "Normal",
      period: { from: "2025-08-01", to: "2025-08-31" },
      baseFee: 2450.8,
      telephony: 120.5,
      total: 2571.3,
      date: "2025-08-25T11:30:00",
      amount: 2571.3,
      status: "delivered",
      dueDate: "2025-09-24T23:59:59",
      description: "Monatliche Serviceleistungen August 2025",
      createdAt: "2025-08-25T11:30:00",
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-2025-0723",
      type: "Normal",
      period: { from: "2025-07-01", to: "2025-07-31" },
      baseFee: 2380.5,
      telephony: 95.2,
      total: 2475.7,
      date: "2025-07-25T10:15:00",
      amount: 2475.7,
      status: "delivered",
      dueDate: "2025-08-24T23:59:59",
      description: "Monatliche Serviceleistungen Juli 2025",
      createdAt: "2025-07-25T10:15:00",
    },
    {
      id: "INV-003",
      invoiceNumber: "INV-2025-0645",
      type: "Normal",
      period: { from: "2025-06-01", to: "2025-06-30" },
      baseFee: 2520.3,
      telephony: 110.8,
      total: 2631.1,
      date: "2025-06-25T09:45:00",
      amount: 2631.1,
      status: "delivered",
      dueDate: "2025-07-25T23:59:59",
      description: "Monatliche Serviceleistungen Juni 2025",
      createdAt: "2025-06-25T09:45:00",
    },
    {
      id: "INV-ST-001",
      invoiceNumber: "ST-2025-001",
      type: "Storno",
      period: { from: "2025-05-01", to: "2025-05-31" },
      baseFee: -2450.8,
      telephony: -120.5,
      total: -2571.3,
      date: "2025-05-20T14:30:00",
      amount: -2571.3,
      status: "delivered",
      dueDate: "2025-06-19T23:59:59",
      description: "Storno Rechnung Mai 2025",
      createdAt: "2025-05-20T14:30:00",
    },
    {
      id: "INV-ERG-001",
      invoiceNumber: "RG-ERG-2025-001",
      type: "Ergänzend",
      period: { from: "2025-08-15", to: "2025-08-15" },
      baseFee: 0,
      telephony: 0,
      total: 150.0,
      date: "2025-08-15T09:00:00",
      amount: 150.0,
      status: "delivered",
      dueDate: "2025-09-14T23:59:59",
      description: "Zusätzliche Serviceleistung",
      createdAt: "2025-08-15T09:00:00",
    },
  ],
  "CUST-002": [
    {
      id: "INV-004",
      invoiceNumber: "INV-2025-0848",
      type: "Normal",
      period: { from: "2025-08-01", to: "2025-08-31" },
      baseFee: 1890.5,
      telephony: 85.3,
      total: 1975.8,
      date: "2025-08-25T11:28:00",
      amount: 1975.8,
      status: "failed",
      dueDate: "2025-09-24T23:59:59",
      description: "Monatliche Serviceleistungen August 2025",
      createdAt: "2025-08-25T11:28:00",
    },
    {
      id: "INV-005",
      invoiceNumber: "INV-2025-0724",
      type: "Normal",
      period: { from: "2025-07-01", to: "2025-07-31" },
      baseFee: 1850.0,
      telephony: 78.2,
      total: 1928.2,
      date: "2025-07-25T10:12:00",
      amount: 1928.2,
      status: "delivered",
      dueDate: "2025-08-24T23:59:59",
      description: "Monatliche Serviceleistungen Juli 2025",
      createdAt: "2025-07-25T10:12:00",
    },
  ],
}

const mockErrorLogs: Record<string, ErrorLog[]> = {
  "CUST-001": [
    {
      id: "ERR-001",
      timestamp: "2025-08-25T11:32:15",
      type: "info",
      message: "Rechnung erfolgreich zugestellt",
      details: "E-Mail an buchhaltung@mueller-gmbh.de gesendet",
    },
    {
      id: "ERR-002",
      timestamp: "2025-07-25T10:17:22",
      type: "warning",
      message: "Verzögerung bei E-Mail-Zustellung",
      details: "E-Mail-Server temporär nicht erreichbar, nach 3 Versuchen erfolgreich",
    },
  ],
  "CUST-002": [
    {
      id: "ERR-003",
      timestamp: "2025-08-25T11:28:45",
      type: "error",
      message: "E-Mail-Zustellung fehlgeschlagen",
      details: "SMTP-Fehler: 550 Mailbox nicht gefunden (finanzen@schmidt-partner.de)",
    },
    {
      id: "ERR-004",
      timestamp: "2025-08-25T11:28:30",
      type: "error",
      message: "PDF-Generierung fehlgeschlagen",
      details: "Template-Fehler: Kundendaten unvollständig",
    },
    {
      id: "ERR-005",
      timestamp: "2025-07-25T10:12:18",
      type: "info",
      message: "Rechnung erfolgreich zugestellt",
      details: "E-Mail an finanzen@schmidt-partner.de gesendet",
    },
  ],
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
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

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  const customer = mockCustomerDetails[customerId]
  const invoices = mockInvoices[customerId] || []
  const errorLogs = mockErrorLogs[customerId] || []

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Kunde nicht gefunden</h1>
            <Link href="/customers">
              <Button variant="outline">Zurück zur Übersicht</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

  const getLogIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-chart-3" />
      default:
        return null
    }
  }

  const getLogBadge = (type: string) => {
    switch (type) {
      case "error":
        return <Badge variant="destructive">Fehler</Badge>
      case "warning":
        return <Badge className="bg-orange-500/10 text-orange-500">Warnung</Badge>
      case "info":
        return (
          <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
            Info
          </Badge>
        )
      default:
        return null
    }
  }


  const deliveredInvoices = invoices.filter((inv) => inv.status === "delivered").length
  const failedInvoices = invoices.filter((inv) => inv.status === "failed").length
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending").length

  const activityLogs = mockActivityLogs[customerId] || []
  const [logSortColumn, setLogSortColumn] = useState<string | null>("timestamp")
  const [logSortOrder, setLogSortOrder] = useState<"asc" | "desc">("desc")
  const [logFilters, setLogFilters] = useState({
    action: "all",
    status: "all",
    search: "",
  })

  const handleLogSort = (column: string) => {
    if (logSortColumn === column) {
      setLogSortOrder(logSortOrder === "asc" ? "desc" : "asc")
    } else {
      setLogSortColumn(column)
      setLogSortOrder("asc")
    }
  }

  const getLogSortIcon = (column: string) => {
    if (logSortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />
    }
    return logSortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-gray-600" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-gray-600" />
    )
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <UserPlus className="w-4 h-4" />
      case "update":
        return <Edit className="w-4 h-4" />
      case "delete":
        return <UserMinus className="w-4 h-4" />
      case "database_query":
        return <Database className="w-4 h-4" />
      case "file_generation":
        return <FileCheck className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create":
        return "Angelegt"
      case "update":
        return "Geändert"
      case "delete":
        return "Gelöscht"
      case "database_query":
        return "Datenbankabfrage"
      case "file_generation":
        return "Dateigenerierung"
      case "invoice_created":
        return "Rechnung erstellt"
      case "invoice_sent":
        return "Rechnung versendet"
      default:
        return action
    }
  }

  const filteredAndSortedLogs = activityLogs
    .filter((log) => {
      const matchesAction = logFilters.action === "all" || log.action === logFilters.action
      const matchesStatus = logFilters.status === "all" || log.status === logFilters.status
      const matchesSearch =
        logFilters.search === "" ||
        log.description.toLowerCase().includes(logFilters.search.toLowerCase()) ||
        (log.target && log.target.toLowerCase().includes(logFilters.search.toLowerCase())) ||
        (log.user && log.user.toLowerCase().includes(logFilters.search.toLowerCase()))
      return matchesAction && matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      if (!logSortColumn) return 0

      let aValue: any, bValue: any

      switch (logSortColumn) {
        case "timestamp":
          aValue = new Date(a.timestamp).getTime()
          bValue = new Date(b.timestamp).getTime()
          break
        case "action":
          aValue = a.action
          bValue = b.action
          break
        case "duration":
          aValue = a.duration || 0
          bValue = b.duration || 0
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (logSortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

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
      <div className="container mx-auto p-6 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/customers">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
            </Link>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
          </div>

          {/* Customer Info */}
          <Card className="mb-6 bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Kundeninformationen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <strong>Kundennummer:</strong> {customer.customerNumber}
                  </p>
                  <p className="text-gray-900">
                    <strong>E-Mail:</strong> {customer.email}
                  </p>
                  <p className="text-gray-900">
                    <strong>Telefon:</strong> {customer.phone}
                  </p>
                  <p className="text-gray-900">
                    <strong>Adresse:</strong> {customer.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{customer.totalInvoices}</div>
                      <p className="text-sm text-gray-600">Gesamt Rechnungen</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{formatCurrency(customer.totalAmount)}</div>
                      <p className="text-sm text-gray-600">Gesamt Betrag</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">{invoices.length}</div>
                <p className="text-sm text-gray-600">Gesamt Rechnungen</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{deliveredInvoices}</div>
                <p className="text-sm text-gray-600">Zugestellt</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{failedInvoices}</div>
                <p className="text-sm text-gray-600">Fehler</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">{pendingInvoices}</div>
                <p className="text-sm text-gray-600">Wartend</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs für Rechnungsübersicht und Log */}
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger
              value="invoices"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              <FileText className="w-4 h-4 mr-2" />
              Rechnungsübersicht
            </TabsTrigger>
            <TabsTrigger
              value="log"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              <Clock className="w-4 h-4 mr-2" />
              Log ({activityLogs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Rechnungsübersicht
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Individuelle Rechnung erstellen
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Individuelle Rechnung erstellen</DialogTitle>
                        <DialogDescription>
                          Erstellen Sie eine individuelle Rechnung mit eigenen Positionen. Alle Positionen können Mehrwertsteuer haben.
                        </DialogDescription>
                      </DialogHeader>
                      <IndividualInvoiceDialog customerId={customer.id} customerName={customer.name} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Rechnungsnummer</TableHead>
                      <TableHead className="text-gray-700">Rechnungstyp</TableHead>
                      <TableHead className="text-gray-700">Zeitraum</TableHead>
                      <TableHead className="text-gray-700">Grundgebühr</TableHead>
                      <TableHead className="text-gray-700">Telefonie</TableHead>
                      <TableHead className="text-gray-700">Gesamt</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Erstellungsdatum</TableHead>
                      <TableHead className="text-gray-700">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-gray-200">
                        <TableCell className="font-medium text-gray-900">{invoice.invoiceNumber}</TableCell>
                        <TableCell>
                          {invoice.type === "Normal" ? (
                            <Badge variant="outline">Normal</Badge>
                          ) : invoice.type === "Storno" ? (
                            <Badge className="bg-red-100 text-red-800">Storno</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800">Ergänzend</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {formatDate(invoice.period.from)} - {formatDate(invoice.period.to)}
                        </TableCell>
                        <TableCell className="text-gray-900">{formatCurrency(invoice.baseFee)}</TableCell>
                        <TableCell className="text-gray-900">{formatCurrency(invoice.telephony)}</TableCell>
                        <TableCell className="font-medium text-gray-900">{formatCurrency(invoice.total)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(invoice.status)}
                            {getStatusBadge(invoice.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{formatDateTime(invoice.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/invoice/${invoice.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-3 h-3" />
                                Ansehen
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              <Download className="w-3 h-3" />
                              PDF
                            </Button>
                            {invoice.type === "Normal" && (
                              <Link href={`/invoice/${invoice.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-600 bg-white hover:bg-red-50"
                                >
                                  Storno
                                </Button>
                              </Link>
                            )}
                            {invoice.status === "failed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 bg-white hover:bg-red-50"
                              >
                                Wiederholen
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
          </TabsContent>

          <TabsContent value="log">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Aktivitätslog</CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Suche nach Beschreibung, Ziel oder Benutzer..."
                      value={logFilters.search}
                      onChange={(e) => setLogFilters({ ...logFilters, search: e.target.value })}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Select
                    value={logFilters.action}
                    onValueChange={(value) => setLogFilters({ ...logFilters, action: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Aktion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Aktionen</SelectItem>
                      <SelectItem value="create">Angelegt</SelectItem>
                      <SelectItem value="update">Geändert</SelectItem>
                      <SelectItem value="delete">Gelöscht</SelectItem>
                      <SelectItem value="database_query">Datenbankabfrage</SelectItem>
                      <SelectItem value="file_generation">Dateigenerierung</SelectItem>
                      <SelectItem value="invoice_created">Rechnung erstellt</SelectItem>
                      <SelectItem value="invoice_sent">Rechnung versendet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={logFilters.status}
                    onValueChange={(value) => setLogFilters({ ...logFilters, status: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="success">Erfolg</SelectItem>
                      <SelectItem value="error">Fehler</SelectItem>
                      <SelectItem value="warning">Warnung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">
                        <div className="flex items-center">
                          Zeitstempel
                          <button onClick={() => handleLogSort("timestamp")} className="ml-1">
                            {getLogSortIcon("timestamp")}
                          </button>
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700">
                        <div className="flex items-center">
                          Aktion
                          <button onClick={() => handleLogSort("action")} className="ml-1">
                            {getLogSortIcon("action")}
                          </button>
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700">Beschreibung</TableHead>
                      <TableHead className="text-gray-700">
                        <div className="flex items-center">
                          Dauer
                          <button onClick={() => handleLogSort("duration")} className="ml-1">
                            {getLogSortIcon("duration")}
                          </button>
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700">
                        <div className="flex items-center">
                          Status
                          <button onClick={() => handleLogSort("status")} className="ml-1">
                            {getLogSortIcon("status")}
                          </button>
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700">Ziel/Benutzer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedLogs.map((log) => (
                      <TableRow key={log.id} className="border-gray-200">
                        <TableCell className="font-mono text-sm text-gray-900">
                          {formatDateTime(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span className="text-gray-900">{getActionLabel(log.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{log.description}</TableCell>
                        <TableCell className="text-gray-900">
                          {log.duration !== undefined ? `${log.duration} ms` : "-"}
                        </TableCell>
                        <TableCell>
                          {log.status === "success" ? (
                            <Badge className="bg-green-100 text-green-800">Erfolg</Badge>
                          ) : log.status === "error" ? (
                            <Badge variant="destructive">Fehler</Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">Warnung</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          <div className="space-y-1">
                            {log.target && <div className="text-sm">{log.target}</div>}
                            {log.user && <div className="text-xs text-gray-500">{log.user}</div>}
                            {log.details && <div className="text-xs text-gray-500">{log.details}</div>}
                          </div>
                        </TableCell>
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

function IndividualInvoiceDialog({ customerId, customerName }: { customerId: string; customerName: string }) {
  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      description: "",
      category: "Sonstiges",
      quantity: 1,
      unitPrice: 0,
      taxRate: 19,
      total: 0,
    },
  ])

  const handleItemChange = (itemId: number, field: string, value: any) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return item
      })
    )
  }

  const handleAddItem = () => {
    const newId = Math.max(...lineItems.map((i) => i.id)) + 1
    setLineItems([
      ...lineItems,
      {
        id: newId,
        description: "",
        category: "Sonstiges",
        quantity: 1,
        unitPrice: 0,
        taxRate: 19,
        total: 0,
      },
    ])
  }

  const handleRemoveItem = (itemId: number) => {
    setLineItems((items) => items.filter((item) => item.id !== itemId))
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const tax = lineItems.reduce((sum, item) => sum + (item.total * item.taxRate) / 100, 0)
  const total = subtotal + tax

  const handleCreate = () => {
    // Hier würde API-Call erfolgen
    alert(`Individuelle Rechnung für ${customerName} wird erstellt...`)
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Positionen</Label>
          <Button onClick={handleAddItem} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Position hinzufügen
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Menge</TableHead>
              <TableHead>Einzelpreis (netto)</TableHead>
              <TableHead>MwSt. %</TableHead>
              <TableHead className="text-right">Gesamt (netto)</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    placeholder="Beschreibung"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Select value={item.category} onValueChange={(v) => handleItemChange(item.id, "category", v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vertrag">Vertrag</SelectItem>
                      <SelectItem value="Telefonie">Telefonie</SelectItem>
                      <SelectItem value="Miete">Miete</SelectItem>
                      <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={item.taxRate}
                    onChange={(e) => handleItemChange(item.id, "taxRate", parseFloat(e.target.value) || 19)}
                    className="w-16"
                  />
                  <span className="ml-1 text-sm">%</span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.total)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Zwischensumme (netto):</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>MwSt. gesamt:</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Gesamtbetrag (brutto):</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Abbrechen</Button>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          Rechnung erstellen
        </Button>
      </DialogFooter>
    </div>
  )
}
