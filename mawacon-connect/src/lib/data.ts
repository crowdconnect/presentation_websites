import type { Contract, Hardware, TvPackage } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const internetPackages: Contract[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '19,90 € mtl.',
    priceAfter: 'Ab dem 13. Monat monatlich 34,90 €',
    downloadSpeed: '100 MBit/s',
    uploadSpeed: '50 MBit/s',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29,90 € mtl.',
    priceAfter: 'Ab dem 13. Monat monatlich 44,90 €',
    downloadSpeed: '250 MBit/s',
    uploadSpeed: '100 MBit/s',
  },
  {
    id: 'expert',
    name: 'Expert',
    price: '39,90 € mtl.',
    priceAfter: 'Ab dem 13. Monat monatlich 54,90 €',
    downloadSpeed: '500 MBit/s',
    uploadSpeed: '200 MBit/s',
  },
];

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

const getImageUrl = (id: string, fallbackSeed: string) => {
    const image = findImage(id);
    return image ? image.imageUrl : `https://picsum.photos/seed/${fallbackSeed}/600/400`;
};

const getImageHint = (id: string, fallbackHint: string) => {
    const image = findImage(id);
    return image ? image.imageHint : fallbackHint;
};

export const hardwareItems: Hardware[] = [
  {
    id: 'router-premium',
    name: 'Mawacon Premium Router',
    price: 'einmalig 149,99 €',
    imageUrl: getImageUrl('router', 'router'),
    imageHint: getImageHint('router', 'router'),
  },
  {
    id: 'repeater-boost',
    name: 'Mawacon WiFi Booster',
    price: 'einmalig 79,99 €',
    imageUrl: getImageUrl('repeater', 'repeater'),
    imageHint: getImageHint('repeater', 'wifi repeater'),
  },
  {
    id: 'waipu-stick',
    name: 'waipu.tv 4K Stick',
    price: 'einmalig 59,99 €',
    imageUrl: getImageUrl('tv_stick', 'tv_stick'),
    imageHint: getImageHint('tv_stick', 'tv stick'),
  },
];

export const tvPackages: TvPackage[] = [
  {
    id: 'comfort',
    name: 'Comfort waipu.tv',
    price: '6,99 €/mtl.',
    channels: '230+',
    hdChannels: '200+',
    recordingHours: 50,
    multiStream: 2,
    waiputhekItems: '20.000+',
    isPlus: false,
    features: [
      'Über 230+ Programme',
      'Über 200+ HD Programme',
      '50 Stunden Aufnahmespeicher',
      'Live-TV, Pause- & Restart-Funktion',
      'Multistream: auf bis zu 2 Geräten',
      'waiputhek: über 20.000+ Highlights',
    ],
  },
  {
    id: 'perfect-plus',
    name: 'Perfect Plus waipu.tv',
    price: '12,99 €/mtl.',
    channels: '300+',
    hdChannels: '290+',
    recordingHours: 150,
    multiStream: 4,
    waiputhekItems: '40.000+',
    isPlus: true,
    features: [
      'Über 300+ Programme',
      'Über 290+ HD Programme',
      'Mehr als 70+ Pay-TV Kanäle',
      '150h Aufnahmespeicher',
      'Live-TV, Pause- & Restart-Funktion',
      'Multistream: auf bis zu 4 Geräten',
      'waiputhek: über 40.000+ Highlights',
    ],
  },
];

export const user = {
  name: 'Dzevad Corhamzic',
  customerId: 'KD-12345678',
  contract: internetPackages[0],
  tvPackage: null as TvPackage | null,
};
