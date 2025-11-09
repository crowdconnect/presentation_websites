export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export interface Contract {
  id: string;
  name: string;
  price: string;
  priceAfter?: string;
  downloadSpeed: string;
  uploadSpeed: string;
}

export interface Hardware {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  imageHint: string;
}

export interface TvPackage {
  id: string;
  name: string;
  price: string;
  features: string[];
  channels: string;
  hdChannels: string;
  recordingHours: number;
  multiStream: number;
  waiputhekItems: string;
  isPlus: boolean;
}
