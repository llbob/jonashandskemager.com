import { extract } from "$std/front_matter/yaml.ts";
import { Work, ProjectImage } from "../types/cultproject.ts";
import { join } from "$std/path/mod.ts";

export async function getWorks(): Promise<Work[]> {
  const works: Work[] = [];
  
  for await (const dirEntry of Deno.readDir("_works")) {
    if (dirEntry.name.endsWith('.md')) {
      const mdContent = await Deno.readTextFile(
        join("_works", dirEntry.name)
      );
      
      const { attrs, body } = extract(mdContent);
      const { title, year, carouselImages, slug } = attrs as {
        title: string;
        year: number;
        headerImageUrl?: string;
        carouselImages?: Array<{url: string; caption?: string}>;
        slug?: string;
      };

      // Generate slug from title if not provided
      const safeSlug = slug || title.toLowerCase().replace(/\s+/g, '-');

      // Handle both old and new image format
      const processedImages: ProjectImage[] = carouselImages?.map(img => {
        if (typeof img === 'string') {
          return { url: (img as string).replace(/^\/?(public\/)?/, '/') };
        }
        return {
          url: img.url.replace(/^\/?(public\/)?/, '/'),
          caption: img.caption
        };
      }) || [];
      
      works.push({
        id: safeSlug,
        slug: safeSlug,
        title,
        year,
        images: processedImages,
        content: body
      });
    }
  }

  return works.sort((a, b) => b.year - a.year);
}

export async function getWorkById(id: string): Promise<Work | null> {
  const works = await getWorks();
  return works.find(project => project.slug === id || project.id === id) || null;
}