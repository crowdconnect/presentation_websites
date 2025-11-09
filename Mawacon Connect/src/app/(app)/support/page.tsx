import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail, Phone, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';

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
  return (
    <div className="space-y-8">
      <PageHeader
        title="Hilfe & Support"
        description="Wir sind für Sie da. Wählen Sie den für Sie passenden Kontaktweg."
      />
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
