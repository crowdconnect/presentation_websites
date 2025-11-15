'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/app/page-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AktionPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Aktion"
        description="Entdecken Sie unsere aktuellen Angebote und Aktionen."
      />

      <div className="space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2" />
            Zurück zum Dashboard
          </Button>
        </Link>

        <Card className="overflow-hidden border-primary border-2">
          <div className="relative w-full aspect-[16/6]">
            <Image
              src="/ad.png"
              alt="Aktion"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Aktuelle Aktion</h2>
          <p className="text-muted-foreground mb-4">
            Entdecken Sie unsere speziellen Angebote und profitieren Sie von exklusiven Vorteilen.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold">Besondere Konditionen</p>
                <p className="text-sm text-muted-foreground">
                  Sichern Sie sich jetzt unsere aktuellen Sonderangebote.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold">Begrenzte Zeit</p>
                <p className="text-sm text-muted-foreground">
                  Diese Aktion ist nur für kurze Zeit verfügbar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold">Exklusiv für Sie</p>
                <p className="text-sm text-muted-foreground">
                  Als bestehender Kunde profitieren Sie von zusätzlichen Vorteilen.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button asChild className="flex-1">
            <Link href="/contracts">Jetzt Tarif upgraden</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/hardware">Hardware ansehen</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

