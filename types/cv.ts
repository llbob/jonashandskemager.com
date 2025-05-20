export interface CVItem {
  year: string;
  content: string;
}

export interface CVSection {
  title: string;
  items: CVItem[];
}

export interface CV {
  sections: CVSection[];
  content: string;
}