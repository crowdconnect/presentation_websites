"use client"

import React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import type { Property } from "@/lib/types"
import { toast } from "sonner"

interface AddPropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPropertyDialog({ open, onOpenChange }: AddPropertyDialogProps) {
  const { addProperty } = useAppStore()
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !address) return

    const property: Property = {
      id: `prop-${Date.now()}`,
      name,
      address,
      imageUrl: preview || "/images/property1.jpg",
      costs: [],
      contracts: [],
      propertyDocuments: [],
      thresholds: [
        { category: "strom", warningValue: 3500, criticalValue: 4500, unit: "kWh" },
        { category: "gas", warningValue: 1200, criticalValue: 1600, unit: "m\u00B3" },
        { category: "wasser", warningValue: 55, criticalValue: 70, unit: "m\u00B3" },
      ],
    }

    addProperty(property)
    toast.success("Immobilie hinzugefuegt")
    setName("")
    setAddress("")
    setImageFile(null)
    setPreview("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Immobilie hinzufuegen</DialogTitle>
          <DialogDescription>
            Geben Sie die Daten der Immobilie ein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Bezeichnung</Label>
            <Input
              id="name"
              placeholder="z.B. Altbauwohnung Mitte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="z.B. Friedrichstr. 42, 10117 Berlin"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Bild (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="h-32 overflow-hidden rounded-lg">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Vorschau"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Hinzufuegen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
