export interface SiteSettings {
  font: string;
  backgroundColor: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const content = await Deno.readTextFile("./_data/siteSettings.json");
    return JSON.parse(content) as SiteSettings;
  } catch (error) {
    console.error("Error reading site settings:", error);
    // Return default settings if file doesn't exist
    return {
      font: "Times New Roman",
      backgroundColor: "#EEEEEE"
    };
  }
}