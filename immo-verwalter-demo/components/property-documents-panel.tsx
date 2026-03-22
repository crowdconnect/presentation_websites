"use client"

import { useState, useRef } from "react"
import { FileText, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import type { Property, PropertyDocument, ReferenceDocumentType } from "@/lib/types"
import { REFERENCE_DOCUMENT_LABELS } from "@/lib/types"
import { toast } from "sonner"

const FILTER_ALL = "all"

const REF_TYPES: ReferenceDocumentType[] = [
  "statik",
  "grundriss",
  "grundbuch",
  "energieausweis",
  "sonstige",
]

interface PropertyDocumentsPanelProps {
  property: Property
}

export function PropertyDocumentsPanel({ property }: PropertyDocumentsPanelProps) {
  const { addPropertyDocument, deletePropertyDocument } = useAppStore()
  const [filter, setFilter] = useState<string>(FILTER_ALL)
  const fileRef = useRef<HTMLInputElement>(null)
  const [refType, setRefType] = useState<ReferenceDocumentType>("grundriss")

  const docs = property.propertyDocuments ?? []

  const filtered =
    filter === FILTER_ALL
      ? docs
      : docs.filter((d) => d.kind === "reference" && d.referenceType === filter)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const doc: PropertyDocument = {
        id: `pdoc-${Date.now()}`,
        propertyId: property.id,
        kind: "reference",
        referenceType: refType,
        fileName: file.name,
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      }
      addPropertyDocument(doc)
      toast.success("Unterlage gespeichert")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
          <Label>Typ der Unterlage</Label>
          <Select
            value={refType}
            onValueChange={(v) => setRefType(v as ReferenceDocumentType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REF_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {REFERENCE_DOCUMENT_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            className="gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Hochladen
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === FILTER_ALL ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter(FILTER_ALL)}
        >
          Alle ({docs.length})
        </Button>
        {REF_TYPES.map((t) => {
          const n = docs.filter((d) => d.kind === "reference" && d.referenceType === t).length
          return (
            <Button
              key={t}
              variant={filter === t ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter(t)}
            >
              {REFERENCE_DOCUMENT_LABELS[t]} ({n})
            </Button>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Statik, Grundriss, Grundbuch und andere Unterlagen ohne Buchungsbezug. Belege aus dem
        Scanner erscheinen weiterhin unter Kosteneinträgen.
      </p>

      <div className="flex flex-col gap-2">
        {filtered.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded border bg-muted">
                {doc.dataUrl.endsWith(".pdf") || doc.fileName.toLowerCase().endsWith(".pdf") ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={doc.dataUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.fileName}</p>
                <p className="text-[10px] text-muted-foreground">
                  {doc.kind === "reference" && doc.referenceType
                    ? REFERENCE_DOCUMENT_LABELS[doc.referenceType]
                    : "Beleg"}
                  {" · "}
                  {new Date(doc.uploadedAt).toLocaleString("de-DE")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  deletePropertyDocument(property.id, doc.id)
                  toast.success("Entfernt")
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Keine Unterlagen in dieser Ansicht.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
