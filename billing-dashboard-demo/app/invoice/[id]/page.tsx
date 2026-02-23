"use client"

import Link from "next/link"
import { ArrowLeft, Send, RefreshCw, Download, FileText, AlertTriangle, Eye, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useState } from "react"
import { useParams } from "next/navigation"

const invoiceDetails = {
  id: "2025-001-001",
  customer: "Firma ABC GmbH",
  customerId: "CUST-001",
  customerAddress: "Musterstraße 123\n12345 Berlin\nDeutschland",
  amount: 1234.56,
  status: "Erfolgreich",
  processingStatus: "Erfolg", // Status für Rechnungserstellung
  date: "26.08.2025",
  dueDate: "15.09.2025",
  billingPeriod: "August 2025",
  evnAvailable: true,
  evnAnonymous: false,
}

// EVN Beispieldaten
const evnConnections = [
  {
    id: 1,
    date: "2025-08-01",
    time: "09:15:23",
    from: "+49 30 12345678",
    to: "+49 30 87654321",
    duration: "00:05:32",
    direction: "Ausgehend",
    cost: 0.12,
  },
  {
    id: 2,
    date: "2025-08-01",
    time: "14:32:11",
    from: "+49 30 12345678",
    to: "+49 40 11111111",
    duration: "00:12:45",
    direction: "Ausgehend",
    cost: 0.28,
  },
  {
    id: 3,
    date: "2025-08-02",
    time: "10:05:07",
    from: "+49 30 12345678",
    to: "+49 221 22222222",
    duration: "00:03:21",
    direction: "Ausgehend",
    cost: 0.08,
  },
  {
    id: 4,
    date: "2025-08-02",
    time: "16:45:33",
    from: "+49 30 12345678",
    to: "+49 89 33333333",
    duration: "00:08:15",
    direction: "Ausgehend",
    cost: 0.19,
  },
]

const invoiceLineItems = [
  {
    id: 1,
    description: "Grundvertrag - Business Paket",
    category: "Vertrag",
    quantity: 1,
    unit: null,
    unitPrice: 89.90,
    taxRate: 19,
    total: 89.90,
    isManual: false,
  },
  {
    id: 2,
    description: "Telefonie - Festnetz Deutschland",
    category: "Telefonie",
    quantity: 245,
    unit: "Minuten",
    unitPrice: 0.02,
    taxRate: 19,
    total: 4.90,
    isManual: false,
  },
  {
    id: 3,
    description: "Router-Miete",
    category: "Miete",
    quantity: 1,
    unit: null,
    unitPrice: 5.00,
    taxRate: 19,
    total: 5.00,
    isManual: false,
  },
  {
    id: 4,
    description: "Zusätzliche Serviceleistung",
    category: "Sonstiges",
    quantity: 1,
    unit: null,
    unitPrice: 25.00,
    taxRate: 19,
    total: 25.00,
    isManual: true,
  },
]

const processingLog = [
  {
    id: 1,
    timestamp: "2025-08-26T14:32:15",
    level: "ERROR",
    message: "PDF-Generierung fehlgeschlagen: Template nicht gefunden",
    component: "PDF Generator",
  },
  {
    id: 2,
    timestamp: "2025-08-26T14:32:45",
    level: "WARNING",
    message: "E-Mail Versand verzögert: SMTP Server überlastet",
    component: "Mail Service",
  },
  {
    id: 3,
    timestamp: "2025-08-26T14:33:12",
    level: "INFO",
    message: "Rechnung erfolgreich erstellt und versendet",
    component: "Billing Engine",
  },
]

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [stornoDialogOpen, setStornoDialogOpen] = useState(false)
  const [stornoItems, setStornoItems] = useState(
    invoiceLineItems.map((item) => ({
      ...item,
      isIncluded: true,
      unitPrice: -item.unitPrice, // Negativ für Storno
      total: -item.total,
    }))
  )
  const [stornoReason, setStornoReason] = useState("")

  const subtotal = invoiceLineItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const stornoSubtotal = stornoItems
    .filter((item) => item.isIncluded)
    .reduce((sum, item) => sum + item.total, 0)
  const stornoTax = stornoSubtotal * 0.19
  const stornoTotal = stornoSubtotal + stornoTax

  const handleStornoItemToggle = (itemId: number) => {
    setStornoItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, isIncluded: !item.isIncluded } : item
      )
    )
  }

  const handleStornoItemChange = (itemId: number, field: string, value: any) => {
    setStornoItems((items) =>
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

  const handleAddStornoItem = () => {
    const newId = Math.max(...stornoItems.map((i) => i.id)) + 1
    setStornoItems([
      ...stornoItems,
      {
        id: newId,
        description: "",
        category: "Sonstiges",
        quantity: 1,
        unit: null,
        unitPrice: 0,
        total: 0,
        isManual: true,
        isIncluded: true,
      },
    ])
  }

  const handleRemoveStornoItem = (itemId: number) => {
    setStornoItems((items) => items.filter((item) => item.id !== itemId))
  }

  const handleCreateStorno = () => {
    // Hier würde API-Call erfolgen
    alert(`Storno-Rechnung wird erstellt...`)
    setStornoDialogOpen(false)
  }

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
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {invoiceDetails.processingStatus}
                </Badge>
                <Link href={`/customer/${invoiceDetails.customerId}`}>
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10">
                    <Eye className="w-4 h-4 mr-1" />
                    Kundendashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                PDF anzeigen
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                PDF generieren
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                EVN neu generieren
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Neu erstellen
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Versenden
              </Button>
              <Dialog open={stornoDialogOpen} onOpenChange={setStornoDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Storno erstellen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Storno-Rechnung erstellen</DialogTitle>
                    <DialogDescription>
                      Wählen Sie die Positionen aus, die storniert werden sollen. Alle Beträge werden automatisch negativ.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="storno-reason">Storno-Grund (optional)</Label>
                      <Textarea
                        id="storno-reason"
                        value={stornoReason}
                        onChange={(e) => setStornoReason(e.target.value)}
                        placeholder="Grund für die Stornierung..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Positionen</Label>
                        <Button onClick={handleAddStornoItem} size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-1" />
                          Position hinzufügen
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Beschreibung</TableHead>
                            <TableHead>Kategorie</TableHead>
                            <TableHead>Menge</TableHead>
                            <TableHead>Einzelpreis</TableHead>
                            <TableHead>MwSt. %</TableHead>
                            <TableHead className="text-right">Gesamt</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stornoItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Checkbox
                                  checked={item.isIncluded}
                                  onCheckedChange={() => handleStornoItemToggle(item.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.description}
                                  onChange={(e) =>
                                    handleStornoItemChange(item.id, "description", e.target.value)
                                  }
                                  disabled={!item.isManual}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.category}
                                  onValueChange={(v) => handleStornoItemChange(item.id, "category", v)}
                                >
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
                                  onChange={(e) =>
                                    handleStornoItemChange(
                                      item.id,
                                      "quantity",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-20"
                                />
                                {item.unit && <span className="ml-1 text-sm">{item.unit}</span>}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    handleStornoItemChange(
                                      item.id,
                                      "unitPrice",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={item.taxRate || 19}
                                  onChange={(e) =>
                                    handleStornoItemChange(
                                      item.id,
                                      "taxRate",
                                      parseFloat(e.target.value) || 19
                                    )
                                  }
                                  className="w-16"
                                />
                                <span className="ml-1 text-sm">%</span>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(item.total)}
                              </TableCell>
                              <TableCell>
                                {item.isManual && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveStornoItem(item.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                          <span>Zwischensumme:</span>
                          <span>{formatCurrency(stornoSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>MwSt. (19%):</span>
                          <span>{formatCurrency(stornoTax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Storno-Gesamtbetrag:</span>
                          <span className="text-red-600">{formatCurrency(stornoTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStornoDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleCreateStorno} className="bg-red-600 hover:bg-red-700">
                      Storno-Rechnung erstellen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(invoiceDetails.amount)}</div>
              <div className="text-sm text-gray-600">Abrechnungszeitraum: {invoiceDetails.billingPeriod}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger
              value="positions"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              Rechnungspositionen
            </TabsTrigger>
            <TabsTrigger
              value="evn"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              EVN
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-800"
            >
              Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <Card>
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
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Zwischensumme:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MwSt. (19%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamtbetrag:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evn">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Einzelverbindungsnachweis (EVN)
                  </CardTitle>
                  {invoiceDetails.evnAvailable && (
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      EVN PDF herunterladen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {invoiceDetails.evnAvailable ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium mb-1">EVN für {invoiceDetails.billingPeriod}</p>
                      <p className="text-sm text-gray-600">
                        {invoiceDetails.evnAnonymous
                          ? "EVN ist anonymisiert (Rufnummern nicht sichtbar)"
                          : "EVN enthält alle Verbindungsdaten"}
                      </p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Datum</TableHead>
                          <TableHead>Uhrzeit</TableHead>
                          <TableHead>Von</TableHead>
                          <TableHead>Nach</TableHead>
                          <TableHead>Dauer</TableHead>
                          <TableHead>Richtung</TableHead>
                          {!invoiceDetails.evnAnonymous && <TableHead>Kosten</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {evnConnections.map((connection) => (
                          <TableRow key={connection.id}>
                            <TableCell>{new Date(connection.date).toLocaleDateString("de-DE")}</TableCell>
                            <TableCell>{connection.time}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {invoiceDetails.evnAnonymous ? "***" : connection.from}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {invoiceDetails.evnAnonymous ? "***" : connection.to}
                            </TableCell>
                            <TableCell>{connection.duration}</TableCell>
                            <TableCell>{connection.direction}</TableCell>
                            {!invoiceDetails.evnAnonymous && (
                              <TableCell>{formatCurrency(connection.cost)}</TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p>Kein EVN verfügbar für diese Rechnung.</p>
                    <Button className="mt-4" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      EVN generieren
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Verarbeitungs-Log
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processingLog.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.level === "ERROR"
                                ? "destructive"
                                : log.level === "WARNING"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={log.level === "WARNING" ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {log.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{log.component}</TableCell>
                        <TableCell>{log.message}</TableCell>
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
