import { slugger } from "github-slugger";

export function generateSlug(text: string): string {
  return slugger.slug(text);
}
