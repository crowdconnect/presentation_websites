import Link from "next/link"
import { ArrowLeft, Play, Download, AlertTriangle, CheckCircle, Clock, XCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

const billingRunDetails = {
  id: "RUN-2025-001",
  date: "26.08.2025",
  time: "14:30",
  status: "Bereit", // Changed to "Bereit" to allow starting
  totalCustomers: 1247,
  completedInvoices: 1247,
  errorCount: 3,
  duration: "23 Minuten",
  startedBy: "Max Mustermann",
}

const invoiceStatuses = [
  { status: "Erfolgreich", count: 1244, color: "text-green-600" },
  { status: "Fehler", count: 3, color: "text-red-600" },
  { status: "Ausstehend", count: 0, color: "text-yellow-600" },
]

const errorLog = [
  {
    id: 1,
    customer: "Firma ABC GmbH",
    error: "Ungültige Rechnungsadresse",
    timestamp: "26.08.2025 14:32",
    severity: "Hoch",
  },
  {
    id: 2,
    customer: "Mustermann KG",
    error: "Fehlende Steuernummer",
    timestamp: "26.08.2025 14:35",
    severity: "Mittel",
  },
  {
    id: 3,
    customer: "Test Solutions",
    error: "Verbindungsfehler zur Datenbank",
    timestamp: "26.08.2025 14:38",
    severity: "Niedrig",
  },
]

const invoices = [
  {
    id: "2025-001-001",
    customer: "Firma ABC GmbH",
    amount: "€262.75",
    status: "Erfolgreich",
    date: "26.08.2025",
    type: "Monatlich",
  },
  {
    id: "2025-001-002",
    customer: "Mustermann KG",
    amount: "€987.43",
    status: "Fehler",
    date: "26.08.2025",
    type: "Monatlich",
  },
  {
    id: "2025-001-003",
    customer: "Tech Solutions GmbH",
    amount: "€2,156.78",
    status: "Erfolgreich",
    date: "26.08.2025",
    type: "Quartalsweise",
  },
  {
    id: "2025-001-004",
    customer: "Digital Services AG",
    amount: "€756.32",
    status: "Ausstehend",
    date: "26.08.2025",
    type: "Monatlich",
  },
  {
    id: "2025-001-005",
    customer: "Innovation Labs",
    amount: "€3,421.90",
    status: "Erfolgreich",
    date: "26.08.2025",
    type: "Jährlich",
  },
]

export default async function BillingRunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const canStartBillingRun = billingRunDetails.status === "Bereit"

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#274366" }}>
      {/* Header */}
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
        <div className="grid md:grid-cols-4 gap-4 mb-6">
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
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input placeholder="Kunde suchen..." className="max-w-sm" icon={<Search className="w-4 h-4" />} />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status filtern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="erfolgreich">Erfolgreich</SelectItem>
                      <SelectItem value="fehler">Fehler</SelectItem>
                      <SelectItem value="ausstehend">Ausstehend</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Typ filtern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Typen</SelectItem>
                      <SelectItem value="monatlich">Monatlich</SelectItem>
                      <SelectItem value="quartalsweise">Quartalsweise</SelectItem>
                      <SelectItem value="jaehrlich">Jährlich</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rechnungs-ID</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              invoice.status === "Erfolgreich"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "Fehler"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.type}</TableCell>
                        <TableCell>
                          <Link href={`/invoice/${invoice.id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Fehlerprotokoll ({errorLog.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {errorLog.map((error) => (
                    <div key={error.id} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{error.customer}</p>
                          <p className="text-red-600">{error.error}</p>
                          <p className="text-sm text-gray-500">{error.timestamp}</p>
                        </div>
                        <Badge
                          variant={
                            error.severity === "Hoch"
                              ? "destructive"
                              : error.severity === "Mittel"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {error.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
