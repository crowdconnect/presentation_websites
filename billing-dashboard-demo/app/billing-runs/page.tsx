"use client"

import Link from "next/link"
import { ArrowLeft, Eye, Play, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const allBillingRuns = [
  {
    id: "RUN-2025-004",
    date: "23.12.2025",
    time: "11:20",
    status: "Bereit",
    invoiceCount: 0,
    errorCount: 3,
    duration: "-",
  },
  {
    id: "RUN-2025-001",
    date: "26.08.2025",
    time: "14:30",
    status: "Abgeschlossen",
    invoiceCount: 1247,
    errorCount: 0,
    duration: "23 Min",
  },
  {
    id: "RUN-2025-002",
    date: "25.08.2025",
    time: "09:15",
    status: "Abgeschlossen",
    invoiceCount: 1198,
    errorCount: 3,
    duration: "28 Min",
  },
  {
    id: "RUN-2025-003",
    date: "24.08.2025",
    time: "16:45",
    status: "Fehler",
    invoiceCount: 1156,
    errorCount: 12,
    duration: "15 Min",
  },

  {
    id: "RUN-2025-005",
    date: "22.08.2025",
    time: "08:30",
    status: "Erstellung",
    invoiceCount: 892,
    errorCount: 1,
    duration: "12 Min",
  },
  {
    id: "RUN-2025-006",
    date: "21.08.2025",
    time: "13:45",
    status: "Abgeschlossen",
    invoiceCount: 1089,
    errorCount: 2,
    duration: "31 Min",
  },
  {
    id: "RUN-2025-007",
    date: "20.08.2025",
    time: "10:15",
    status: "Abgeschlossen",
    invoiceCount: 1134,
    errorCount: 0,
    duration: "26 Min",
  },
  {
    id: "RUN-2025-008",
    date: "19.08.2025",
    time: "15:30",
    status: "Fehler",
    invoiceCount: 967,
    errorCount: 8,
    duration: "18 Min",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Abgeschlossen":
      return "bg-green-100 text-green-800"
    case "Fehler":
      return "bg-red-100 text-red-800"
    case "Erstellung":
      return "bg-yellow-100 text-yellow-800"
    case "Bereit":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AllBillingRunsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedRuns = allBillingRuns
    .filter((run) => {
      const matchesSearch = run.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || run.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date.split(".").reverse().join("-"))
          bValue = new Date(b.date.split(".").reverse().join("-"))
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "invoices":
          aValue = a.invoiceCount
          bValue = b.invoiceCount
          break
        case "errors":
          aValue = a.errorCount
          bValue = b.errorCount
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#274366" }}>
      {/* Header */}
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
        <div className="mb-6">
          <Link href="/billing-overview">
            <Button variant="ghost" className="mb-4 text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Alle Rechnungsläufe</h1>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechnungslauf ID suchen..."
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
            <option value="Abgeschlossen" className="text-black">
              Abgeschlossen
            </option>
            <option value="Fehler" className="text-black">
              Fehler
            </option>
            <option value="Erstellung" className="text-black">
              Erstellung
            </option>
            <option value="Bereit" className="text-black">
              Bereit
            </option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-")
              setSortBy(field)
              setSortOrder(order as "asc" | "desc")
            }}
            className="px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-md text-sm"
          >
            <option value="date-desc" className="text-black">
              Datum (Neueste zuerst)
            </option>
            <option value="date-asc" className="text-black">
              Datum (Älteste zuerst)
            </option>
            <option value="status-asc" className="text-black">
              Status (A-Z)
            </option>
            <option value="invoices-desc" className="text-black">
              Rechnungen (Höchste zuerst)
            </option>
            <option value="errors-desc" className="text-black">
              Fehler (Meiste zuerst)
            </option>
          </select>
        </div>

        {/* All Billing Runs Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Rechnungslauf Historie ({filteredAndSortedRuns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700">Rechnungslauf ID</TableHead>
                  <TableHead className="text-gray-700">Datum & Zeit</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Rechnungen</TableHead>
                  <TableHead className="text-gray-700">Fehler</TableHead>
                  <TableHead className="text-gray-700">Dauer</TableHead>
                  <TableHead className="text-gray-700">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedRuns.map((run) => (
                  <TableRow key={run.id} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">{run.id}</TableCell>
                    <TableCell className="text-gray-900">
                      <div>
                        <div className="font-medium">{run.date}</div>
                        <div className="text-sm text-gray-700">{run.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(run.status)}>{run.status}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">{run.invoiceCount}</TableCell>
                    <TableCell>
                      {run.errorCount > 0 ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          {run.errorCount}
                        </div>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900">{run.duration}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/billing-run/${run.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
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
      </div>
    </div>
  )
}
