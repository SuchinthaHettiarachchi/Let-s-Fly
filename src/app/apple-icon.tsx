import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS shows transparency as black, so the round logo sits on the brand yellow.
export default function AppleIcon() {
  return brandIcon(size.width, "#ffea00");
}
