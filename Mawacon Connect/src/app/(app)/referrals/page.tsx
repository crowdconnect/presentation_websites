import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Gift, Share2 } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';

export default function ReferralsPage() {
  const referralCode = 'MAWA-FREUNDE-24';
  const referralImage = PlaceHolderImages.find(img => img.id === 'customer_referral');

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
                <Button variant="ghost" size="icon">
                    <Copy />
                    <span className="sr-only">Code kopieren</span>
                </Button>
            </CardContent>
        </Card>
        <Button size="lg">
          <Share2 className="mr-2" />
          Jetzt Code teilen
        </Button>
      </div>

    </div>
  );
}
