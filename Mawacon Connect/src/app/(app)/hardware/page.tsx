import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { hardwareItems } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';

export default function HardwarePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Hardware bestellen"
        description="Erweitern Sie Ihr Heimnetzwerk mit unserer Premium-Hardware."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hardwareItems.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={item.imageHint}
                />
              </div>
            </CardHeader>
            <div className="flex flex-col flex-grow p-6">
                <CardTitle className="mb-2">{item.name}</CardTitle>
                <CardContent className="p-0 flex-grow">
                <p className="text-2xl font-bold">{item.price}</p>
                </CardContent>
                <CardFooter className="p-0 pt-6">
                <Button className="w-full">
                    <ShoppingCart className="mr-2" />
                    In den Warenkorb
                </Button>
                </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
