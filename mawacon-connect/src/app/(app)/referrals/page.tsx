'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Gift, Share2, Check } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { referralReward, user } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

// Generiere einen eindeutigen Code basierend auf der Customer-ID
function generateReferralCode(customerId: string): string {
  // Extrahiere Zahlen aus der Customer-ID (z.B. "KD-12345678" -> "12345678")
  const numbers = customerId.replace(/\D/g, '');
  // Erstelle einen Hash aus den Zahlen für Konsistenz
  // Verwende die letzten 6 Ziffern und erstelle einen alphanumerischen Code
  const hash = numbers.slice(-6);
  // Erstelle einen deterministischen Code basierend auf der ID
  // Konvertiere die Zahlen in einen alphanumerischen String
  const codePart = parseInt(hash, 10).toString(36).toUpperCase().padStart(4, '0');
  // Füge einen zusätzlichen Teil hinzu für mehr Eindeutigkeit
  const extraPart = (parseInt(hash.slice(0, 3), 10) % 1000).toString(36).toUpperCase().padStart(3, '0');
  return `MAWA-FREUNDE-${codePart}${extraPart}`;
}

export default function ReferralsPage() {
  const referralCode = generateReferralCode(user.customerId);
  const referralImage = PlaceHolderImages.find(img => img.id === 'customer_referral');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Code kopiert!',
        description: 'Der Code wurde in die Zwischenablage kopiert.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Code konnte nicht kopiert werden.',
        variant: 'destructive',
      });
    }
  };

  const handleShareCode = async () => {
    const shareText = `Empfehle dir Mawacon! Verwende meinen Code: ${referralCode}\n\nwww.mawacon.eu/friends/${referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mawacon Empfehlungscode',
          text: shareText,
        });
      } catch (err) {
        // User hat das Teilen abgebrochen oder Fehler aufgetreten
        if ((err as Error).name !== 'AbortError') {
          // Fallback: Code in Zwischenablage kopieren
          copyToClipboard(referralCode);
        }
      }
    } else {
      // Fallback für Browser ohne Share API
      copyToClipboard(referralCode);
    }
  };

  const handleCopyCode = () => {
    copyToClipboard(referralCode);
  };

  return (
    <div className="space-y-8">
      {referralImage && (
        <div className="relative w-full overflow-hidden rounded-3xl shadow-lg">
          <Image
            src={referralImage.imageUrl}
            alt={referralImage.description}
            width={1920}
            height={700}
            className="h-full w-full object-cover"
            priority
            data-ai-hint={referralImage.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/10 flex flex-col justify-end p-8 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/80">Freunde werben</p>
            <h1 className="text-3xl sm:text-4xl font-semibold">Teilen, buchen, gemeinsam profitieren.</h1>
          </div>
        </div>
      )}

      <PageHeader
        title="Freunde werben Freunde"
        description="Empfehlen Sie Mawacon weiter und entscheiden Sie im Admin-Bereich, welches Geschenk Sie und Ihre Freunde erhalten."
      />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">So funktioniert's</h2>
              <p className="text-muted-foreground">Ein Plan, drei Schritte, doppelte Freude.</p>
            </div>
            <ol className="list-decimal list-inside space-y-4 text-lg">
              <li>
                <span className="font-semibold">Code teilen:</span> Persönlichen Empfehlungscode mit Freunden & Nachbarn teilen.
              </li>
              <li>
                <span className="font-semibold">Freunde buchen:</span> Der Code wird beim Vertragsabschluss eingetragen.
              </li>
              <li>
                <span className="font-semibold">Geschenk wählen:</span> Nach Aktivierung bekommen Sie ihr Geschenk.
              </li>
            </ol>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="size-5 text-primary" />
              Aktuelles Geschenk
            </CardTitle>
            <CardDescription>Das erhalten Sie aktuell für jede erfolgreiche Empfehlung.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={referralReward.imageUrl}
                alt={referralReward.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                data-ai-hint={referralReward.imageHint}
              />
            </div>
            <div>
              <p className="text-lg font-semibold">{referralReward.name}</p>
              <p className="text-sm text-muted-foreground">{referralReward.description}</p>
            </div>
            {referralReward.perks && referralReward.perks.length > 0 && (
              <>
                <Separator />
                <ul className="space-y-2 text-sm">
                  {referralReward.perks.map((perk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="size-4 text-primary mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-semibold">Ihr persönlicher Empfehlungscode</h3>
        <Card className="max-w-md mx-auto">
            <CardContent className="p-6 flex items-center justify-between">
                <span className="text-2xl font-bold tracking-widest text-primary font-mono">
                    {referralCode}
                </span>
                <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
                    <span className="sr-only">Code kopieren</span>
                </Button>
            </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={handleShareCode} className="w-full sm:w-auto">
            <Share2 className="mr-2" />
            Jetzt Code teilen
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleCopyCode}>
            <Copy className="mr-2 size-4" />
            Code kopieren
          </Button>
        </div>
      </div>

    </div>
  );
}
