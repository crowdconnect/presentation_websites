'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { user } from '@/lib/data';
import { ArrowRight, Gift, Tv, FileSignature, Users, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Willkommen zurück, ${user.name.split(' ')[0]}!`}
        description="Hier ist eine Übersicht über Ihr Konto."
      />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">Aktion</h2>
        <Card 
          className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-primary border-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="relative w-full aspect-[16/6]">
            <Image
              src="/ad.png"
              alt="Werbung"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full w-full max-h-[95vh] h-auto p-0 m-0 rounded-none">
          <div className="relative w-full">
            <Image
              src="/ad.png"
              alt="Aktion"
              width={1920}
              height={720}
              className="w-full h-auto object-contain"
              sizes="100vw"
            />
          </div>
          <div className="p-6 bg-background">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                setIsDialogOpen(false);
                router.push('/contracts');
              }}
            >
              Zur Aktion
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileSignature className="size-6 text-primary" />
              <CardTitle>Ihr Vertrag</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-2xl font-bold">{user.contract.name}</p>
            <p className="text-muted-foreground">
              {user.contract.downloadSpeed} Download
            </p>
            <p className="text-muted-foreground">
              {user.contract.uploadSpeed} Upload
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/contracts">
                Vertrag verwalten <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Tv className="size-6 text-primary" />
              <CardTitle>Ihr TV-Paket</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            {user.tvPackage ? (
              <>
                <p className="text-2xl font-bold">{user.tvPackage.name}</p>
                <p className="text-muted-foreground">
                  {user.tvPackage.channels} Sender
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Sie haben noch kein TV-Paket gebucht.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/tv-packages">
                TV-Pakete ansehen <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col border-primary/50 bg-primary/5 text-primary-foreground">
           <CardHeader>
             <div className="flex items-center gap-3 text-primary">
                <Users className="size-6" />
                <CardTitle>Freunde werben</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-foreground">
                Empfehlen Sie Mawacon und sichern Sie sich und Ihren Freunden tolle Prämien!
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/referrals">
                Jetzt Prämie sichern <Gift className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-6 text-destructive" />
              <CardTitle>Störung melden</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Haben Sie Probleme mit Ihrem Internet oder TV? Melden Sie eine Störung schnell und einfach.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/support">
                Störung melden <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
