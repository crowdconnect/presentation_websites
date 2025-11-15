'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail, Phone, MessageSquare, Copy, Check } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { user } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

// Mock WhatsApp number
const WHATSAPP_NUMBER = "491234567890";
const WHATSAPP_MESSAGE = "Hallo Mawacon-Team, ich habe eine Störung und benötige Hilfe.";
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;


const supportOptions = [
  {
    icon: <MessageSquare className="size-8 text-primary" />,
    title: 'Störung per WhatsApp melden',
    description: 'Der schnellste Weg bei Störungen. Senden Sie uns eine Nachricht und wir helfen Ihnen umgehend.',
    buttonLabel: 'WhatsApp Chat starten',
    href: whatsappLink,
    external: true,
  },
  {
    icon: <Phone className="size-8 text-primary" />,
    title: 'Telefonischer Support',
    description: 'Rufen Sie uns an für persönliche Unterstützung durch unser Service-Team. Mo-Fr, 8-18 Uhr.',
    buttonLabel: 'Jetzt anrufen: 0800 123 456',
    href: 'tel:0800123456',
  },
  {
    icon: <Mail className="size-8 text-primary" />,
    title: 'E-Mail Support',
    description: 'Für allgemeine Anfragen oder wenn Sie uns Dokumente senden möchten.',
    buttonLabel: 'E-Mail schreiben',
    href: 'mailto:support@mawacon.de',
  },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Generiere Vertragsnummer und Anschlussnummer basierend auf Customer-ID
  const contractNumber = `V-${user.customerId.replace('KD-', '')}`;
  const connectionNumber = `A-${user.customerId.replace('KD-', '').slice(-6)}`;

  const customerInfo = [
    { label: 'Kundennummer', value: user.customerId, id: 'customer' },
    { label: 'Vertragsnummer', value: contractNumber, id: 'contract' },
    { label: 'Anschlussnummer', value: connectionNumber, id: 'connection' },
  ];

  const copyToClipboard = async (text: string, id: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: 'Kopiert!',
        description: `${label} wurde in die Zwischenablage kopiert.`,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Nummer konnte nicht kopiert werden.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hilfe & Support"
        description="Wir sind für Sie da. Wählen Sie den für Sie passenden Kontaktweg."
      />

      <Card>
        <CardHeader>
          <CardTitle>Ihre Kundendaten</CardTitle>
          <CardDescription>
            Diese Daten benötigen Sie möglicherweise für die Störungsmeldung. Klicken Sie auf eine Nummer, um sie zu kopieren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {customerInfo.map((info) => (
              <div
                key={info.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => copyToClipboard(info.value, info.id, info.label)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {info.label}
                    </p>
                    <p className="text-lg font-semibold font-mono">
                      {info.value}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(info.value, info.id, info.label);
                    }}
                  >
                    {copiedId === info.id ? (
                      <Check className="size-4 text-primary" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {supportOptions.map((option, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              {option.icon}
              <div className="grid gap-1">
                <CardTitle>{option.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{option.description}</CardDescription>
            </CardContent>
            <CardContent>
              <Button asChild className="w-full" variant={index === 0 ? 'default' : 'secondary'}>
                <Link href={option.href} target={option.external ? '_blank' : '_self'} rel={option.external ? "noopener noreferrer" : ""}>
                  {option.buttonLabel}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
