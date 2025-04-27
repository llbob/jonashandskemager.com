import { extract } from "$std/front_matter/yaml.ts";
import { About } from "../types/about.ts";

export async function getAbout(): Promise<About | null> {
  try {
    const mdContent = await Deno.readTextFile("about.md");
    const { body } = extract(mdContent);
    
    return {
      content: body
    };
  } catch (error) {
    console.error("Error reading about.md:", error);
    return null;
  }
} 