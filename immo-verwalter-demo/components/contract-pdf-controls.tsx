"use client"

import { useRef } from "react"
import { FileText, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Contract } from "@/lib/types"
import { toast } from "sonner"

interface ContractPdfControlsProps {
  propertyId: string
  contractId: string
  fileName?: string
  dataUrl?: string
  updateContract: (propertyId: string, contractId: string, updates: Partial<Contract>) => void
}

export function ContractPdfControls({
  propertyId,
  contractId,
  fileName,
  dataUrl,
  updateContract,
}: ContractPdfControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast.error("Bitte eine PDF-Datei waehlen")
      e.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      updateContract(propertyId, contractId, {
        contractPdfFileName: file.name,
        contractPdfDataUrl: reader.result as string,
      })
      toast.success("PDF gespeichert")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function handleRemove() {
    updateContract(propertyId, contractId, {
      contractPdfFileName: undefined,
      contractPdfDataUrl: undefined,
    })
    toast.success("PDF entfernt")
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onFileChange}
      />
      {dataUrl && fileName ? (
        <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
          <div className="flex items-start gap-2 text-xs">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 break-all font-medium text-foreground">{fileName}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent"
              onClick={() => window.open(dataUrl, "_blank", "noopener,noreferrer")}
            >
              Anzeigen
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs bg-transparent" asChild>
              <a href={dataUrl} download={fileName}>
                Herunterladen
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-destructive hover:text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Entfernen
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full gap-1.5 text-xs bg-transparent"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          PDF anhaengen (optional)
        </Button>
      )}
    </>
  )
}
