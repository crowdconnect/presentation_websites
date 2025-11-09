import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Upload } from 'lucide-react';
import { internetPackages, user } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';

export default function ContractsPage() {
  const currentUserPackage = user.contract;
  const availableUpgrades = internetPackages.filter(p => p.id !== currentUserPackage.id);

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
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Tarif upgraden</h2>
        <div className="grid gap-6 md:grid-cols-2">
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
              </CardContent>
              <CardFooter>
                <Button className="w-full">Jetzt wechseln</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
