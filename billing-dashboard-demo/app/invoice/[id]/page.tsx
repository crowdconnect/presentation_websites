import Link from "next/link"
import { ArrowLeft, Send, RefreshCw, Download, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const invoiceDetails = {
  id: "2025-001-001",
  customer: "Firma ABC GmbH",
  customerAddress: "Musterstraße 123\n12345 Berlin\nDeutschland",
  amount: "€1,234.56",
  status: "Erfolgreich",
  date: "26.08.2025",
  dueDate: "15.09.2025",
  type: "Monatlich",
  billingPeriod: "August 2025",
}

const invoiceLineItems = [
  {
    id: 1,
    description: "Grundvertrag - Business Paket",
    category: "Vertrag",
    quantity: 1,
    unitPrice: "€89.90",
    total: "€89.90",
  },
  {
    id: 2,
    description: "Telefonie - Festnetz Deutschland",
    category: "Telefonie",
    quantity: 245,
    unit: "Minuten",
    unitPrice: "€0.02",
    total: "€4.90",
  },
  {
    id: 3,
    description: "Telefonie - Mobilfunk Deutschland",
    category: "Telefonie",
    quantity: 1250,
    unit: "Minuten",
    unitPrice: "€0.05",
    total: "€62.50",
  },
  {
    id: 4,
    description: "Internet - Datenvolumen",
    category: "Internet",
    quantity: 500,
    unit: "GB",
    unitPrice: "€0.10",
    total: "€50.00",
  },
  {
    id: 5,
    description: "SMS-Versand",
    category: "Telefonie",
    quantity: 150,
    unit: "SMS",
    unitPrice: "€0.09",
    total: "€13.50",
  },
]

const errorLog = [
  {
    id: 1,
    timestamp: "26.08.2025, 14:32:15",
    level: "ERROR",
    message: "PDF-Generierung fehlgeschlagen: Template nicht gefunden",
    component: "PDF Generator",
    resolved: true,
  },
  {
    id: 2,
    timestamp: "26.08.2025, 14:32:45",
    level: "WARNING",
    message: "E-Mail Versand verzögert: SMTP Server überlastet",
    component: "Mail Service",
    resolved: true,
  },
  {
    id: 3,
    timestamp: "26.08.2025, 14:33:12",
    level: "INFO",
    message: "Rechnung erfolgreich erstellt und versendet",
    component: "Billing Engine",
    resolved: true,
  },
]

const subtotal = invoiceLineItems.reduce((sum, item) => sum + Number.parseFloat(item.total.replace("€", "")), 0)
const tax = subtotal * 0.19
const total = subtotal + tax

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
          <Link href="/billing-run/RUN-2025-001">
            <Button variant="ghost" className="mb-4 text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Rechnungslauf
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Rechnung {id}</h1>
              <p className="text-white/80">{invoiceDetails.customer}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Neu erstellen
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Versenden
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Rechnungsdetails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-100 text-green-800">{invoiceDetails.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Datum:</span>
                <span>{invoiceDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fällig:</span>
                <span>{invoiceDetails.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Typ:</span>
                <span>{invoiceDetails.type}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Kunde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-sm">{invoiceDetails.customerAddress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Rechnungsbetrag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{invoiceDetails.amount}</div>
              <div className="text-sm text-gray-600">Abrechnungszeitraum: {invoiceDetails.billingPeriod}</div>
            </CardContent>
          </Card>
        </div>

        {/* Line Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Rechnungspositionen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Menge</TableHead>
                  <TableHead>Einzelpreis</TableHead>
                  <TableHead className="text-right">Gesamt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceLineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit || "Stk."}
                    </TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell className="text-right font-medium">{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Zwischensumme:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>MwSt. (19%):</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Gesamtbetrag:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Fehlerprotokoll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zeitstempel</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Komponente</TableHead>
                  <TableHead>Nachricht</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLog.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell className="font-mono text-sm">{error.timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          error.level === "ERROR" ? "destructive" : error.level === "WARNING" ? "secondary" : "outline"
                        }
                        className={error.level === "WARNING" ? "bg-yellow-100 text-yellow-800" : ""}
                      >
                        {error.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{error.component}</TableCell>
                    <TableCell>{error.message}</TableCell>
                    <TableCell>
                      <Badge
                        variant={error.resolved ? "secondary" : "destructive"}
                        className={error.resolved ? "bg-green-100 text-green-800" : ""}
                      >
                        {error.resolved ? "Behoben" : "Offen"}
                      </Badge>
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
