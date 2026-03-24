// critters-process.js
import Critters from "critters";
import fs from "fs/promises";
import { glob } from "glob";

const critters = new Critters({
  path: "_site",
  publicPath: "/",
  preload: "js-lazy",
  pruneSource: false,
});

const htmlFiles = await glob("_site/**/*.html");
for (const file of htmlFiles) {
  let html = await fs.readFile(file, "utf-8");

  // Crittersで処理
  html = await critters.process(html);

  // onloadが抜けているpreloadリンクに手動で追加
  html = html.replace(
    /<link([^>]*?)rel="preload"([^>]*?)as="style"([^>]*?)>/g,
    '<link$1rel="preload"$2as="style"$3 onload="this.rel=\'stylesheet\'">'
  );

  await fs.writeFile(file, html);
}
