export interface WorkImage {
  url: string;
  caption?: string;
  videoUrl?: string;
}

export interface WorkReference {
  referenceNumber: number;
  reference: string;
}

export interface WorkInfo {
  string: string;
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  year: number;
  headerImageUrl: string;
  images: WorkImage[];
  content: string;
  references?: WorkReference[];
  additional?: WorkInfo[];
}