'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Gift, Share2, Check } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { user } from '@/lib/data';
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

  const referralLink = `www.mawacon.eu/friends/${referralCode}`;

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: type === 'code' ? 'Code kopiert!' : 'Link kopiert!',
        description: type === 'code' 
          ? 'Der Code wurde in die Zwischenablage kopiert.'
          : 'Der Link wurde in die Zwischenablage kopiert.',
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

  const handleShareCode = () => {
    copyToClipboard(referralLink, 'link');
  };

  const handleCopyCode = () => {
    copyToClipboard(referralCode, 'code');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Freunde werben Freunde"
        description="Empfehlen Sie uns weiter und sichern Sie sich und Ihren Freunden tolle Prämien!"
      />

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-primary mb-4">So einfach geht's:</h2>
                <ol className="list-decimal list-inside space-y-4 text-lg">
                    <li>
                        <span className="font-semibold">Code teilen:</span> Teilen Sie Ihren persönlichen Code mit Freunden & Nachbarn.
                    </li>
                    <li>
                        <span className="font-semibold">Freunde bestellen:</span> Ihr Freund gibt bei der Bestellung Ihren Code an.
                    </li>
                    <li>
                        <span className="font-semibold">Prämie kassieren:</span> Sie beide erhalten eine Gutschrift auf Ihrer nächsten Rechnung!
                    </li>
                </ol>
            </div>
            {referralImage && (
                <div className="relative min-h-[250px] md:min-h-full">
                <Image
                    src={referralImage.imageUrl}
                    alt={referralImage.description}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    data-ai-hint={referralImage.imageHint}
                />
                </div>
            )}
        </div>
      </Card>
      
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
        <Button size="lg" onClick={handleShareCode}>
          <Share2 className="mr-2" />
          Jetzt Code teilen
        </Button>
      </div>

    </div>
  );
}
