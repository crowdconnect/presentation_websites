"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, Clock, RefreshCw, Users, Eye } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface BillingRun {
  id: string
  status: "running" | "completed" | "failed" | "pending" | "creating"
  startTime: string
  endTime?: string
  totalCustomers: number
  processedCustomers: number
  errors: number
}

interface Customer {
  id: string
  name: string
  email: string
  lastInvoiceDate: string
  status: "delivered" | "failed" | "pending"
  amount: number
  invoiceNumber?: string
}

const mockBillingRuns: BillingRun[] = [
  {
    id: "RUN-2025-001",
    status: "creating", // Added "creating" status for invoice generation
    startTime: "2025-08-26T10:30:00",
    totalCustomers: 1250,
    processedCustomers: 847,
    errors: 3,
  },
  {
    id: "RUN-2025-002",
    status: "completed",
    startTime: "2025-08-25T09:15:00",
    endTime: "2025-08-25T11:42:00",
    totalCustomers: 1180,
    processedCustomers: 1180,
    errors: 0,
  },
]

const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Müller GmbH",
    email: "buchhaltung@mueller-gmbh.de",
    lastInvoiceDate: "2025-08-25T11:30:00",
    status: "delivered",
    amount: 2450.8,
    invoiceNumber: "INV-2025-0847",
  },
  {
    id: "CUST-002",
    name: "Schmidt & Partner",
    email: "finanzen@schmidt-partner.de",
    lastInvoiceDate: "2025-08-25T11:28:00",
    status: "failed",
    amount: 1890.5,
    invoiceNumber: "INV-2025-0848",
  },
  {
    id: "CUST-003",
    name: "Weber Industries",
    email: "rechnungen@weber-ind.com",
    lastInvoiceDate: "2025-08-25T11:25:00",
    status: "delivered",
    amount: 3200.0,
    invoiceNumber: "INV-2025-0849",
  },
  {
    id: "CUST-004",
    name: "Fischer Consulting",
    email: "admin@fischer-consulting.de",
    lastInvoiceDate: "2025-08-25T11:22:00",
    status: "pending",
    amount: 1650.25,
  },
  {
    id: "CUST-005",
    name: "Bauer Logistik",
    email: "buchhaltung@bauer-logistik.de",
    lastInvoiceDate: "2025-08-25T11:20:00",
    status: "delivered",
    amount: 4100.75,
    invoiceNumber: "INV-2025-0850",
  },
]

export function BillingRunOverview() {
  const [selectedRun, setSelectedRun] = useState<string>(mockBillingRuns[0].id)

  const currentRun = mockBillingRuns.find((run) => run.id === selectedRun)
  const progress = currentRun ? (currentRun.processedCustomers / currentRun.totalCustomers) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "creating": // Added creating status icon
        return <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
      case "running":
        return <RefreshCw className="w-4 h-4 animate-spin text-secondary" />
      case "completed":
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
      case "creating": // Added creating status badge
        return (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
            Erstellung
          </Badge>
        )
      case "running":
        return (
          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
            Läuft
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
            Abgeschlossen
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Fehler</Badge>
      case "pending":
        return <Badge variant="outline">Wartend</Badge>
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
            Zugestellt
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

  return (
    <div className="space-y-6">
      {/* Billing Run History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <RefreshCw className="w-5 h-5" />
            Rechnungslauf Historie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lauf ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Startzeit</TableHead>
                <TableHead>Endzeit</TableHead>
                <TableHead>Kunden</TableHead>
                <TableHead>Fehler</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBillingRuns.map((run) => (
                <TableRow key={run.id} className={selectedRun === run.id ? "bg-blue-50" : ""}>
                  <TableCell className="font-medium text-blue-800">{run.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      {getStatusBadge(run.status)}
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(run.startTime)}</TableCell>
                  <TableCell>{run.endTime ? formatDateTime(run.endTime) : "-"}</TableCell>
                  <TableCell>
                    {run.processedCustomers}/{run.totalCustomers}
                  </TableCell>
                  <TableCell>
                    <span className={run.errors > 0 ? "text-destructive font-medium" : "text-green-600"}>
                      {run.errors}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRun(run.id)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Invoice Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="w-5 h-5" />
            Kunden Rechnungsübersicht
          </CardTitle>
          <Link href="/customers">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
            >
              <Eye className="w-4 h-4" />
              Komplette Übersicht
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kunde</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Letzte Rechnung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Rechnungsnummer</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell>{formatDateTime(customer.lastInvoiceDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(customer.status)}
                      {getStatusBadge(customer.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(customer.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.invoiceNumber || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/customer/${customer.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                        >
                          Ansehen
                        </Button>
                      </Link>
                      {customer.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-red-50 bg-transparent"
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
  )
}
