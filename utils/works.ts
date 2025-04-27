import { extract } from "$std/front_matter/yaml.ts";
import { Work, WorkImage} from "../types/works.ts";
import { join } from "$std/path/mod.ts";

// Helper function to process the markdown links in text
function processMarkdownLinks(text: string): string {
  // Regular expression to match markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline">$1</a>');
}

export async function getWorks(): Promise<Work[]> {
  const works: Work[] = [];
  
  for await (const dirEntry of Deno.readDir("_works")) {
    if (dirEntry.name.endsWith('.md')) {
      const mdContent = await Deno.readTextFile(
        join("_works", dirEntry.name)
      );
      
      const { attrs, body } = extract(mdContent);
      const { title, year, carouselImages, slug, references, additional} = attrs as {
        title: string;
        year: number;
        headerImageUrl?: string;
        carouselImages?: Array<{url: string; caption?: string; videoUrl?: string}>;
        slug?: string;
        references?: Array<{referenceNumber: number; reference: string[] | string}>;
        additional?: Array<{string: string}>;
      };

      // Generate slug from title if not provided
      const safeSlug = slug || title.toLowerCase().replace(/\s+/g, '-');

      // Handle both old and new image format
      const processedImages: WorkImage[] = carouselImages?.map(img => {
        if (typeof img === 'string') {
          return { url: (img as string).replace(/^\/?(public\/)?/, '/') };
        }
        return {
          url: img.url.replace(/^\/?(public\/)?/, '/'),
          caption: img.caption,
          videoUrl: img.videoUrl // Extract the videoUrl field
        };
      }) || [];
      
      // Process references to handle markdown links
      const processedReferences = references?.map(ref => {
        // Handle references that might be an array or a string
        let processedReference = "";
        if (Array.isArray(ref.reference)) {
          processedReference = ref.reference.map(item => processMarkdownLinks(item)).join("");
        } else {
          processedReference = processMarkdownLinks(ref.reference);
        }
        
        return {
          referenceNumber: ref.referenceNumber,
          reference: processedReference
        };
      });
      
      works.push({
        id: safeSlug,
        slug: safeSlug,
        title,
        year,
        headerImageUrl: typeof attrs.headerImageUrl === 'string' 
          ? attrs.headerImageUrl.replace(/^\/?(public\/)?/, '/') 
          : '',
        images: processedImages,
        content: body,
        references: processedReferences,
        additional: additional
      });
    }
  }

  return works.sort((a, b) => b.year - a.year);
}

export async function getWorkById(id: string): Promise<Work | null> {
  const works = await getWorks();
  return works.find(work => work.slug === id || work.id === id) || null;
}