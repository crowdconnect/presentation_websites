import Link from "next/link"
import { ArrowLeft, Eye, Play, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

const currentRun = {
  id: "RUN-2025-001",
  status: "Erstellung",
  progress: 68,
  completed: 847,
  total: 1250,
  errors: 3,
}

const lastRun = {
  id: "RUN-2025-002",
  status: "Erfolgreich",
}

const billingHistory = [
  {
    id: "RUN-2025-001",
    status: "Erstellung",
    startTime: "26.08.2025, 10:30",
    endTime: "-",
    customers: "847/1250",
    errors: 3,
  },
  {
    id: "RUN-2025-002",
    status: "Abgeschlossen",
    startTime: "25.08.2025, 09:15",
    endTime: "25.08.2025, 11:42",
    customers: "1180/1180",
    errors: 0,
  },
]

const customerOverview = [
  {
    name: "Müller GmbH",
    email: "buchhaltung@mueller-gmbh.de",
    lastInvoice: "25.08.2025, 11:30",
    status: "Zugestellt",
    amount: "2.450,80 €",
    invoiceNumber: "INV-2025-0847",
  },
  {
    name: "Schmidt & Partner",
    email: "finanzen@schmidt-partner.de",
    lastInvoice: "25.08.2025, 11:28",
    status: "Fehler",
    amount: "1.890,50 €",
    invoiceNumber: "INV-2025-0848",
  },
  {
    name: "Weber Industries",
    email: "rechnungen@weber-ind.com",
    lastInvoice: "25.08.2025, 11:25",
    status: "Zugestellt",
    amount: "3.200,00 €",
    invoiceNumber: "INV-2025-0849",
  },
  {
    name: "Fischer Consulting",
    email: "admin@fischer-consulting.de",
    lastInvoice: "25.08.2025, 11:22",
    status: "Wartend",
    amount: "1.650,25 €",
    invoiceNumber: "-",
  },
  {
    name: "Bauer Logistik",
    email: "buchhaltung@bauer-logistik.de",
    lastInvoice: "25.08.2025, 11:20",
    status: "Zugestellt",
    amount: "4.100,75 €",
    invoiceNumber: "INV-2025-0850",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Abgeschlossen":
    case "Erfolgreich":
    case "Zugestellt":
      return "bg-green-100 text-green-800"
    case "Fehler":
      return "bg-red-100 text-red-800"
    case "Erstellung":
      return "bg-orange-100 text-orange-800"
    case "Bereit":
      return "bg-blue-100 text-blue-800"
    case "Wartend":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Abgeschlossen":
    case "Erfolgreich":
    case "Zugestellt":
      return <CheckCircle className="w-4 h-4" />
    case "Fehler":
      return <AlertCircle className="w-4 h-4" />
    case "Erstellung":
      return <Clock className="w-4 h-4" />
    case "Bereit":
      return <Play className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function BillingOverviewPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktueller Lauf</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentRun.id}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(currentRun.status)}>
                  {getStatusIcon(currentRun.status)}
                  <span className="ml-1">{currentRun.status}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Rechnungen und Einzelverbindungsnachweise werden erstellt...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fortschritt</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentRun.completed}/{currentRun.total}
              </div>
              <Progress value={currentRun.progress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{currentRun.progress}% abgeschlossen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fehler</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{currentRun.errors}</div>
              <p className="text-xs text-muted-foreground mt-2">Fehler aufgetreten</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Letzter Lauf</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastRun.id}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(lastRun.status)}>
                  {getStatusIcon(lastRun.status)}
                  <span className="ml-1">{lastRun.status}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Rechnungslauf Historie
            </CardTitle>
            <Link href="/billing-runs">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Komplette Übersicht
              </Button>
            </Link>
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
                {billingHistory.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(run.status)}>
                        {getStatusIcon(run.status)}
                        <span className="ml-1">{run.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{run.startTime}</TableCell>
                    <TableCell>{run.endTime}</TableCell>
                    <TableCell>{run.customers}</TableCell>
                    <TableCell>
                      {run.errors > 0 ? (
                        <span className="text-red-600 font-medium">{run.errors}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/billing-run/${run.id}`}>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Kunden Rechnungsübersicht
            </CardTitle>
            <Link href="/customers">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
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
                {customerOverview.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.lastInvoice}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{customer.amount}</TableCell>
                    <TableCell>{customer.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/customer/CUST-${String(index + 1).padStart(3, "0")}`}>
                          <Button variant="outline" size="sm">
                            Ansehen
                          </Button>
                        </Link>
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
