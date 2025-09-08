"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, Clock, ArrowLeft, FileText, AlertTriangle, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  status: "delivered" | "failed" | "pending"
  dueDate: string
  description: string
}

interface ErrorLog {
  id: string
  timestamp: string
  type: "error" | "warning" | "info"
  message: string
  details?: string
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

const mockInvoices: Record<string, Invoice[]> = {
  "CUST-001": [
    {
      id: "INV-001",
      invoiceNumber: "INV-2025-0847",
      date: "2025-08-25T11:30:00",
      amount: 2450.8,
      status: "delivered",
      dueDate: "2025-09-24T23:59:59",
      description: "Monatliche Serviceleistungen August 2025",
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-2025-0723",
      date: "2025-07-25T10:15:00",
      amount: 2380.5,
      status: "delivered",
      dueDate: "2025-08-24T23:59:59",
      description: "Monatliche Serviceleistungen Juli 2025",
    },
    {
      id: "INV-003",
      invoiceNumber: "INV-2025-0645",
      date: "2025-06-25T09:45:00",
      amount: 2520.3,
      status: "delivered",
      dueDate: "2025-07-25T23:59:59",
      description: "Monatliche Serviceleistungen Juni 2025",
    },
  ],
  "CUST-002": [
    {
      id: "INV-004",
      invoiceNumber: "INV-2025-0848",
      date: "2025-08-25T11:28:00",
      amount: 1890.5,
      status: "failed",
      dueDate: "2025-09-24T23:59:59",
      description: "Monatliche Serviceleistungen August 2025",
    },
    {
      id: "INV-005",
      invoiceNumber: "INV-2025-0724",
      date: "2025-08-25T11:28:00",
      amount: 1850.0,
      status: "delivered",
      dueDate: "2025-08-24T23:59:59",
      description: "Monatliche Serviceleistungen Juli 2025",
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

  const deliveredInvoices = invoices.filter((inv) => inv.status === "delivered").length
  const failedInvoices = invoices.filter((inv) => inv.status === "failed").length
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending").length

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

        {/* Rechnungsübersicht */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Rechnungsübersicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700">Rechnungsnummer</TableHead>
                  <TableHead className="text-gray-700">Datum</TableHead>
                  <TableHead className="text-gray-700">Beschreibung</TableHead>
                  <TableHead className="text-gray-700">Betrag</TableHead>
                  <TableHead className="text-gray-700">Fälligkeitsdatum</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-gray-900">{formatDateTime(invoice.date)}</TableCell>
                    <TableCell className="text-gray-900">{invoice.description}</TableCell>
                    <TableCell className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-gray-900">{formatDateTime(invoice.dueDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.status)}
                        {getStatusBadge(invoice.status)}
                      </div>
                    </TableCell>
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
      </div>
    </div>
  )
}
