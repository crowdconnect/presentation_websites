"use client"

import Image from "next/image"
import { MapPin, TrendingUp, TrendingDown, Zap, Flame, Droplets } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"
import {
  getMonthlyTotalCost,
  getMonthlyTotalIncome,
  getConsumptionStatus,
  getOverallStatus,
  getAnnualConsumption,
  formatCurrency,
} from "@/lib/helpers"
import { CATEGORY_UNITS } from "@/lib/types"

interface PropertyCardProps {
  property: Property
  onClick: () => void
}

const statusColors = {
  normal: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  critical: "bg-destructive text-destructive-foreground",
}

const statusLabels = {
  normal: "Normal",
  warning: "Erhoht",
  critical: "Kritisch",
}

const categoryIcons = {
  strom: Zap,
  gas: Flame,
  wasser: Droplets,
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const monthlyCost = getMonthlyTotalCost(property)
  const monthlyIncome = getMonthlyTotalIncome(property)
  const overallStatus = getOverallStatus(property)
  const balance = monthlyIncome - monthlyCost

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="relative h-36 overflow-hidden sm:h-44">
        <Image
          src={property.imageUrl || "/placeholder.svg"}
          alt={property.name}
          fill
          priority
          loading="eager"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white">{property.name}</h3>
          <div className="flex items-center gap-1 text-white/80">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{property.address}</span>
          </div>
        </div>
        <Badge
          className={`absolute right-3 top-3 ${statusColors[overallStatus]} border-0`}
        >
          {statusLabels[overallStatus]}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Monatskosten</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(monthlyCost)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Bilanz</p>
            <div className="flex items-center gap-1">
              {balance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <p
                className={`text-lg font-semibold ${
                  balance >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {(["strom", "gas", "wasser"] as const).map((cat) => {
            const status = getConsumptionStatus(property, cat)
            const consumption = getAnnualConsumption(property, cat)
            const Icon = categoryIcons[cat]
            const unit = CATEGORY_UNITS[cat]
            return (
              <div
                key={cat}
                className={`flex flex-1 flex-col items-center rounded-lg px-2 py-2 ${
                  status === "critical"
                    ? "bg-destructive/10"
                    : status === "warning"
                      ? "bg-warning/10"
                      : "bg-muted"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    status === "critical"
                      ? "text-destructive"
                      : status === "warning"
                        ? "text-warning"
                        : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`mt-1 text-xs font-semibold ${
                    status === "critical"
                      ? "text-destructive"
                      : status === "warning"
                        ? "text-warning"
                        : "text-foreground"
                  }`}
                >
                  {Math.round(consumption).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {unit}/Jahr
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
