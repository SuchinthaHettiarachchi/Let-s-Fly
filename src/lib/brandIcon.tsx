import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** The round yellow logo as a square PNG, for the favicon and the Apple touch icon. */
export async function brandIcon(px: number, background = "transparent") {
  const logo = await readFile(join(process.cwd(), "public/images/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={src} width={px} height={px} style={{ borderRadius: "50%" }} />
      </div>
    ),
    { width: px, height: px },
  );
}
