'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { referralReward } from '@/lib/data';
import {
  Mail,
  Phone,
  Link as LinkIcon,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Gift,
} from 'lucide-react';

const initialConfig = {
  emailRouting: {
    defaultRoute: 'support@mawacon.de',
    escalationEmail: 'lead-support@mawacon.de',
    hardwareOrders: 'hardware@mawacon.de',
    tvBookings: 'tv@mawacon.de',
    contractUpgrades: 'contracts@mawacon.de',
    referralNotifications: 'marketing@mawacon.de',
  },
  support: {
    whatsappLink: 'https://wa.me/491234567890',
    supportEmail: 'support@mawacon.de',
    supportPhone: '+49 800 123 456',
  },
  advertising: {
    enabled: true,
    title: 'Aktion',
    text: 'Sichern Sie sich jetzt unser Glasfaser-Angebot!',
    bannerUrl: '/ad.png',
  },
  referralGift: {
    name: referralReward.name,
    description: referralReward.description,
    imageUrl: referralReward.imageUrl,
  },
  general: {
    defaultSenderEmail: 'no-reply@mawacon.de',
    replyToEmail: 'kontakt@mawacon.de',
    footerInfo: 'Mawacon GmbH · Musterstraße 1 · 12345 Berlin · Tel: 0800 123 456',
  },
};

type AdminConfig = typeof initialConfig;

const labelMap: Record<keyof AdminConfig['emailRouting'], string> = {
  defaultRoute: 'Allgemeine Anfragen',
  escalationEmail: 'Eskalationen',
  hardwareOrders: 'Hardware-Bestellungen',
  tvBookings: 'TV-Paket Buchungen',
  contractUpgrades: 'Vertragsupgrades',
  referralNotifications: 'Prämien-Benachrichtigungen',
};

export default function AdminPage() {
  const [config, setConfig] = useState<AdminConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const updateConfig = <K extends keyof AdminConfig, F extends keyof AdminConfig[K]>(
    section: K,
    field: F,
    value: AdminConfig[K][F],
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateConfig('advertising', 'bannerUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferralGiftUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateConfig('referralGift', 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Einstellungen gespeichert',
      description: 'Alle Änderungen wurden erfolgreich übernommen.',
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Konfiguration</h1>
        <p className="text-muted-foreground">
          Verwalten Sie die Einstellungen für die Kundenoberfläche.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
              E-Mail Routing
            </CardTitle>
            <CardDescription>
              Zieladressen für Kundenbenachrichtigungen.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {Object.entries(config.emailRouting).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label>{labelMap[key as keyof AdminConfig['emailRouting']]}</Label>
                <Input
                  value={value}
                  onChange={(e) =>
                    updateConfig('emailRouting', key as keyof AdminConfig['emailRouting'], e.target.value)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              Support Konfiguration
            </CardTitle>
            <CardDescription>
              Kontaktoptionen, die den Kunden angezeigt werden.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>WhatsApp-Link oder Nummer</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={config.support.whatsappLink}
                  onChange={(e) => updateConfig('support', 'whatsappLink', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Support E-Mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  className="pl-10"
                  value={config.support.supportEmail}
                  onChange={(e) => updateConfig('support', 'supportEmail', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Support Telefon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={config.support.supportPhone}
                  onChange={(e) => updateConfig('support', 'supportPhone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              Werbemanagement
            </CardTitle>
            <CardDescription>
              Steuern Sie das Dashboard-Banner.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <p className="font-medium">Banner anzeigen</p>
                <p className="text-sm text-muted-foreground">Aktivieren oder deaktivieren Sie das Aktionsbanner.</p>
              </div>
              <Switch
                checked={config.advertising.enabled}
                onCheckedChange={(value) => updateConfig('advertising', 'enabled', value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Banner Titel</Label>
                <Input
                  value={config.advertising.title}
                  onChange={(e) => updateConfig('advertising', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Banner Text</Label>
                <Textarea
                  rows={2}
                  value={config.advertising.text}
                  onChange={(e) => updateConfig('advertising', 'text', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Banner Bild</Label>
              <Input type="file" accept="image/*" onChange={handleBannerUpload} />
              {config.advertising.bannerUrl && (
                <div className="border rounded-lg overflow-hidden mt-2">
                  <img src={config.advertising.bannerUrl} alt="Banner" className="w-full max-h-64 object-cover" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="size-5 text-primary" />
              Referral Geschenk
            </CardTitle>
            <CardDescription>
              Pflegen Sie Name, Beschreibung und Bild des aktuellen Rewards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Geschenkname</Label>
                <Input
                  value={config.referralGift.name}
                  onChange={(e) => updateConfig('referralGift', 'name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Textarea
                  rows={3}
                  value={config.referralGift.description}
                  onChange={(e) => updateConfig('referralGift', 'description', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bild</Label>
              <Input type="file" accept="image/*" onChange={handleReferralGiftUpload} />
              {config.referralGift.imageUrl && (
                <div className="border rounded-lg overflow-hidden mt-2">
                  <img src={config.referralGift.imageUrl} alt={config.referralGift.name} className="w-full max-h-64 object-cover" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5 text-primary" />
              Allgemeine Systemeinstellungen
            </CardTitle>
            <CardDescription>
              Globale E-Mail- und Kontaktinformationen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Standard-Absender</Label>
                <Input
                  type="email"
                  value={config.general.defaultSenderEmail}
                  onChange={(e) => updateConfig('general', 'defaultSenderEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Reply-To</Label>
                <Input
                  type="email"
                  value={config.general.replyToEmail}
                  onChange={(e) => updateConfig('general', 'replyToEmail', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Footer / Kontaktinfo</Label>
              <Textarea
                rows={3}
                value={config.general.footerInfo}
                onChange={(e) => updateConfig('general', 'footerInfo', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Speichern...' : 'Einstellungen speichern'}
        </Button>
      </div>
    </div>
  );
}
