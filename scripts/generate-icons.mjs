import fs from "fs";
import path from "path";
import url from "url";

// Lazily import sharp to allow the script to be present before installing
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch (e) {
  console.error(
    "\nMissing devDependency: sharp.\nInstall with: npm i -D sharp"
  );
  process.exitCode = 1;
  process.exit(1);
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");
const source = path.join(publicDir, "logo.png"); // Place your logo here (PNG or JPG recommended)

async function ensureDirs() {
  await fs.promises.mkdir(iconsDir, { recursive: true });
}

async function main() {
  await ensureDirs();

  if (!fs.existsSync(source)) {
    console.error(
      `\nSource logo not found at: ${source}\nPlease add your logo file named 'logo.png' to the public/ folder and re-run.`
    );
    process.exitCode = 1;
    return;
  }

  console.log("Generating icons from", source);

  const sizes = [
    { out: path.join(iconsDir, "icon-32.png"), size: 32 },
    { out: path.join(iconsDir, "icon-48.png"), size: 48 },
    { out: path.join(iconsDir, "icon-72.png"), size: 72 },
    { out: path.join(iconsDir, "icon-96.png"), size: 96 },
    { out: path.join(iconsDir, "icon-128.png"), size: 128 },
    { out: path.join(publicDir, "icon-192.png"), size: 192 },
    { out: path.join(iconsDir, "icon-256.png"), size: 256 },
    { out: path.join(iconsDir, "icon-384.png"), size: 384 },
    { out: path.join(publicDir, "icon-512.png"), size: 512 },
  ];

  // Apple touch icon
  const appleTouch = {
    out: path.join(publicDir, "apple-touch-icon.png"),
    size: 180,
  };

  // Badge for notifications (72px)
  const badge = { out: path.join(publicDir, "badge-72.png"), size: 72 };

  // Maskable (add padding and a background to keep safe area)
  async function generateMaskable(size, outPath) {
    const bg = { r: 255, g: 255, b: 255, alpha: 1 };
    const pad = Math.round(size * 0.12); // ~12% padding for safe area
    const canvas = sharp({
      create: { width: size, height: size, channels: 4, background: bg },
    });
    const resized = await sharp(source)
      .resize(size - pad * 2, size - pad * 2, { fit: "contain" })
      .png()
      .toBuffer();
    await canvas
      .composite([{ input: resized, top: pad, left: pad }])
      .png({ compressionLevel: 9 })
      .toFile(outPath);
  }

  try {
    // Generate standard sizes
    await Promise.all(
      sizes.map(({ out, size }) =>
        sharp(source)
          .resize(size, size, { fit: "contain" })
          .png({ compressionLevel: 9 })
          .toFile(out)
      )
    );

    // Apple touch icon
    await sharp(source)
      .resize(appleTouch.size, appleTouch.size, { fit: "contain" })
      .png({ compressionLevel: 9 })
      .toFile(appleTouch.out);

    // Badge icon
    await sharp(source)
      .resize(badge.size, badge.size, { fit: "contain" })
      .png({ compressionLevel: 9 })
      .toFile(badge.out);

    // Maskable icons (192 and 512)
    await generateMaskable(192, path.join(publicDir, "icon-192-maskable.png"));
    await generateMaskable(512, path.join(publicDir, "icon-512-maskable.png"));

    // Favicon ICO using png-to-ico with 16/32/48 sizes
    const icoOut = path.join(publicDir, "favicon.ico");
    try {
      const pngToIco = (await import("png-to-ico")).default;
      const tmp16 = path.join(publicDir, "favicon-16.png");
      const tmp32 = path.join(publicDir, "favicon-32.png");
      const tmp48 = path.join(publicDir, "favicon-48.png");
      await sharp(source).resize(16, 16).png().toFile(tmp16);
      await sharp(source).resize(32, 32).png().toFile(tmp32);
      await sharp(source).resize(48, 48).png().toFile(tmp48);
      const icoBuf = await pngToIco([tmp16, tmp32, tmp48]);
      await fs.promises.writeFile(icoOut, icoBuf);
      await Promise.all([
        fs.promises.unlink(tmp16),
        fs.promises.unlink(tmp32),
        fs.promises.unlink(tmp48),
      ]);
    } catch (e) {
      console.warn(
        "png-to-ico not installed; skipping favicon.ico generation. Install with: npm i -D png-to-ico"
      );
    }

    console.log("Icons generated successfully in public/ and public/icons/.");
  } catch (err) {
    console.error("Error generating icons:", err);
    process.exitCode = 1;
  }
}

main();
