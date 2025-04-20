export interface ProjectImage {
  url: string;
  caption?: string;
}

export interface Work {
  id: string;
  slug: string;  // New explicit slug field
  title: string;
  year: number;
  images: ProjectImage[];
  content: string;
}