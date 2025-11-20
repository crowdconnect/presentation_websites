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
import { Mail, ArrowLeft, Send } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSuccess(true);
      toast({
        title: 'E-Mail gesendet',
        description: 'Wir haben Ihnen einen Link zum Zurücksetzen des Passworts geschickt.',
      });
    } catch (error) {
      toast({
        title: 'Fehler beim Zurücksetzen',
        description: 'Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle className="text-2xl font-bold text-center">Passwort vergessen</CardTitle>
            <CardDescription className="text-center">
              Geben Sie Ihre E-Mail-Adresse ein, um den Zurücksetzungslink zu erhalten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Wir haben Ihnen eine E-Mail mit weiteren Anweisungen gesendet. Bitte prüfen Sie Ihr Postfach.
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 size-4" /> Zurück zur Anmeldung
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Wird gesendet...' : (
                    <>
                      <Send className="mr-2 size-4" />
                      Link zusenden
                    </>
                  )}
                </Button>

                <div className="text-center text-sm">
                  <Link href="/login" className="text-primary hover:underline">
                    Zurück zur Anmeldung
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
