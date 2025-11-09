import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { tvPackages, user } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';

export default function TvPackagesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="TV-Pakete buchen"
        description="Erleben Sie Fernsehen neu mit unseren waipu.tv Paketen."
      />
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {tvPackages.map((pkg) => (
          <Card key={pkg.id} className={`flex flex-col ${pkg.isPlus ? 'border-2 border-primary' : ''}`}>
             {pkg.isPlus && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-semibold">
                <Star className="mr-2 fill-current" />
                Bestseller
              </Badge>
            )}
            <CardHeader className="items-center text-center">
              <CardTitle className="text-3xl">{pkg.name}</CardTitle>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-5xl font-bold">{pkg.price.split('€')[0]}</span>
                <span className="text-xl text-muted-foreground">€/mtl.</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={user.tvPackage?.id === pkg.id}>
                {user.tvPackage?.id === pkg.id ? 'Bereits gebucht' : 'Jetzt buchen'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Zusätzliche Hardware</CardTitle>
            <CardDescription>Optimieren Sie Ihr TV-Erlebnis mit dem waipu.tv 4K Stick.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">waipu.tv 4K Stick</p>
                    <p className="text-muted-foreground">Für den besten Empfang auf Ihrem Fernseher.</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">einmalig 59,99 €</p>
                    <Button>Zum Stick</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
