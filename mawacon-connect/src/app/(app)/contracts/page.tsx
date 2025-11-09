'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Download, Upload, Phone, Smartphone, Calendar, Check, Loader2, ArrowRight } from 'lucide-react';
import { internetPackages, user } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';
import type { Contract } from '@/lib/types';

export default function ContractsPage() {
  const [selectedPackage, setSelectedPackage] = useState<Contract | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const currentUserPackage = user.contract;
  
  // Extrahiere den Preiswert aus dem String (z.B. "24,90 € mtl." -> 24.90)
  const getPriceValue = (priceString: string): number => {
    const match = priceString.match(/(\d+),(\d+)/);
    if (match) {
      return parseFloat(`${match[1]}.${match[2]}`);
    }
    return 0;
  };
  
  const currentPrice = getPriceValue(currentUserPackage.price);
  
  // Nur Tarife anzeigen, die teurer sind als der aktuelle Tarif
  const availableUpgrades = internetPackages.filter(p => {
    if (p.id === currentUserPackage.id) return false;
    const packagePrice = getPriceValue(p.price);
    return packagePrice > currentPrice;
  });

  const handleUpgradeClick = (pkg: Contract) => {
    setSelectedPackage(pkg);
    setDialogStep('confirm');
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogStep('processing');
    // Simuliere Verarbeitung
    setTimeout(() => {
      setDialogStep('success');
    }, 2000);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setDialogStep('confirm');
      setSelectedPackage(null);
    }, 300);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vertragsübersicht & Wechsel"
        description="Verwalten Sie Ihren Internettarif und entdecken Sie Upgrade-Möglichkeiten."
      />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Ihr aktueller Tarif</h2>
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-primary">{currentUserPackage.name}</CardTitle>
                <CardDescription>Aktiver Tarif</CardDescription>
              </div>
               <div className="flex items-center gap-2 text-primary font-semibold">
                <CheckCircle className="size-5" />
                <span>Aktiv</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{currentUserPackage.price.split(' ')[0]}</span>
                <span className="text-muted-foreground">€/mtl.</span>
            </div>
            {currentUserPackage.priceAfter && <p className="text-sm text-muted-foreground">{currentUserPackage.priceAfter}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                    <Download className="size-5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">{currentUserPackage.downloadSpeed}</p>
                        <p className="text-sm text-muted-foreground">Download</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Upload className="size-5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">{currentUserPackage.uploadSpeed}</p>
                        <p className="text-sm text-muted-foreground">Upload</p>
                    </div>
                </div>
            </div>
            {(currentUserPackage.landlinePhone || currentUserPackage.mobilePhone || currentUserPackage.contractTerm) && (
              <div className="pt-4 space-y-2 border-t">
                {currentUserPackage.landlinePhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="size-4 text-muted-foreground mt-1"/>
                    <div>
                      <p className="text-sm font-medium">Festnetz Telefonie</p>
                      <p className="text-sm text-muted-foreground">{currentUserPackage.landlinePhone}</p>
                    </div>
                  </div>
                )}
                {currentUserPackage.mobilePhone && (
                  <div className="flex items-start gap-3">
                    <Smartphone className="size-4 text-muted-foreground mt-1"/>
                    <div>
                      <p className="text-sm font-medium">Mobilfunk Telefonie</p>
                      <p className="text-sm text-muted-foreground">{currentUserPackage.mobilePhone}</p>
                    </div>
                  </div>
                )}
                {currentUserPackage.contractTerm && (
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground"/>
                    <p className="text-sm text-muted-foreground">{currentUserPackage.contractTerm} Vertragslaufzeit</p>
                  </div>
                )}
              </div>
            )}
            {currentUserPackage.features && currentUserPackage.features.length > 0 && (
              <div className="pt-4 space-y-2 border-t">
                <p className="text-sm font-medium mb-2">Zusatzleistungen:</p>
                <ul className="space-y-1">
                  {currentUserPackage.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 text-primary"/>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Tarif upgraden</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableUpgrades.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{pkg.price.split(' ')[0]}</span>
                    <span className="text-muted-foreground">€/mtl.</span>
                </div>
                {pkg.priceAfter && <p className="text-sm text-muted-foreground">{pkg.priceAfter}</p>}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3">
                        <Download className="size-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">{pkg.downloadSpeed}</p>
                            <p className="text-sm text-muted-foreground">Download</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Upload className="size-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">{pkg.uploadSpeed}</p>
                            <p className="text-sm text-muted-foreground">Upload</p>
                        </div>
                    </div>
                </div>
                {(pkg.landlinePhone || pkg.mobilePhone || pkg.contractTerm) && (
                  <div className="pt-4 space-y-2 border-t">
                    {pkg.landlinePhone && (
                      <div className="flex items-start gap-2">
                        <Phone className="size-3 text-muted-foreground mt-1 flex-shrink-0"/>
                        <p className="text-xs text-muted-foreground">{pkg.landlinePhone}</p>
                      </div>
                    )}
                    {pkg.mobilePhone && (
                      <div className="flex items-start gap-2">
                        <Smartphone className="size-3 text-muted-foreground mt-1 flex-shrink-0"/>
                        <p className="text-xs text-muted-foreground">{pkg.mobilePhone}</p>
                      </div>
                    )}
                    {pkg.contractTerm && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3 text-muted-foreground flex-shrink-0"/>
                        <p className="text-xs text-muted-foreground">{pkg.contractTerm}</p>
                      </div>
                    )}
                  </div>
                )}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="pt-4 space-y-1 border-t">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="size-3 text-primary flex-shrink-0"/>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleUpgradeClick(pkg)}>Glasfaser sichern</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          {dialogStep === 'confirm' && selectedPackage && (
            <>
              <DialogHeader>
                <DialogTitle>Tarif-Upgrade bestätigen</DialogTitle>
                <DialogDescription>
                  Möchten Sie wirklich von {currentUserPackage.name} zu {selectedPackage.name} wechseln?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Aktueller Tarif:</span>
                    <span className="font-semibold">{currentUserPackage.name}</span>
                  </div>
                  <div className="flex justify-center items-center py-2">
                    <ArrowRight className="size-5 text-muted-foreground rotate-90" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 border-2 border-primary rounded-lg">
                    <span className="text-sm font-medium">Neuer Tarif:</span>
                    <span className="font-semibold text-primary">{selectedPackage.name}</span>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Neuer Monatspreis:</span>
                    <span className="font-semibold">{selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Download:</span>
                    <span className="font-semibold">{selectedPackage.downloadSpeed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Upload:</span>
                    <span className="font-semibold">{selectedPackage.uploadSpeed}</span>
                  </div>
                  {selectedPackage.contractTerm && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vertragslaufzeit:</span>
                      <span className="font-semibold">{selectedPackage.contractTerm}</span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
                <Button onClick={handleConfirm}>Upgrade bestätigen</Button>
              </DialogFooter>
            </>
          )}

          {dialogStep === 'processing' && (
            <>
              <DialogHeader>
                <DialogTitle>Upgrade wird verarbeitet</DialogTitle>
                <DialogDescription>
                  Bitte warten Sie, während wir Ihr Upgrade durchführen...
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="size-12 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Ihr Tarif wird aktualisiert...</p>
              </div>
            </>
          )}

          {dialogStep === 'success' && selectedPackage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="size-6 text-primary" />
                  Upgrade erfolgreich!
                </DialogTitle>
                <DialogDescription>
                  Ihr Tarif wurde erfolgreich auf {selectedPackage.name} aktualisiert.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Neuer Tarif:</span>
                      <span className="font-semibold text-primary">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monatspreis:</span>
                      <span className="font-semibold">{selectedPackage.price}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Die Änderungen werden innerhalb der nächsten 24 Stunden aktiviert. 
                    Sie erhalten eine Bestätigungs-E-Mail.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleClose} className="w-full">Verstanden</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
