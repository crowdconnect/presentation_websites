'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Hash, MapPin, CheckCircle } from 'lucide-react';

const registerSchema = z.object({
  customerNumber: z.string().min(1, 'Bitte geben Sie Ihre Kundennummer ein'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  postalCode: z.string().regex(/^\d{5}$/, 'Bitte geben Sie eine gültige 5-stellige PLZ ein'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Simuliere Registrierungs-Prozess
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simuliere E-Mail-Versand
      console.log('Bestätigungs-E-Mail würde gesendet werden an:', data.email);
      console.log('Kundennummer:', data.customerNumber);
      console.log('PLZ:', data.postalCode);
      
      setIsSuccess(true);
      toast({
        title: 'Registrierung erfolgreich',
        description: 'Eine Bestätigungs-E-Mail wurde an Sie gesendet. Bitte überprüfen Sie Ihr Postfach.',
      });
    } catch (error) {
      toast({
        title: 'Registrierung fehlgeschlagen',
        description: 'Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/mawacon-logo.png"
                alt="Mawacon Logo"
                width={150}
                height={40}
                priority
              />
            </Link>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Registrierung erfolgreich!</CardTitle>
              <CardDescription className="text-center">
                Wir haben Ihnen eine Bestätigungs-E-Mail gesendet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  Bitte überprüfen Sie Ihr E-Mail-Postfach und klicken Sie auf den Bestätigungslink, 
                  um Ihre Registrierung abzuschließen.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/login">Zur Anmeldung</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/mawacon-logo.png"
              alt="Mawacon Logo"
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Registrieren</CardTitle>
            <CardDescription className="text-center">
              Geben Sie Ihre Kundendaten ein, um sich zu registrieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Kundennummer</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="customerNumber"
                    type="text"
                    placeholder="KD-12345678"
                    className="pl-10"
                    {...register('customerNumber')}
                  />
                </div>
                {errors.customerNumber && (
                  <p className="text-sm text-destructive">{errors.customerNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postleitzahl</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="12345"
                    maxLength={5}
                    className="pl-10"
                    {...register('postalCode')}
                  />
                </div>
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>Wird verarbeitet...</>
                ) : (
                  <>
                    <UserPlus className="mr-2 size-4" />
                    Registrieren
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Mit der Registrierung stimmen Sie unseren AGB und der Datenschutzerklärung zu. 
                Sie erhalten eine Bestätigungs-E-Mail mit einem Link zur Aktivierung Ihres Kontos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Bereits registriert?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Jetzt anmelden
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

