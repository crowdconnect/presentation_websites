import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { user } from '@/lib/data';
import { ArrowRight, Gift, Tv, FileSignature, Users } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title={`Willkommen zurück, ${user.name.split(' ')[0]}!`}
        description="Hier ist eine Übersicht über Ihr Konto."
      />

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
      </div>
    </div>
  );
}
