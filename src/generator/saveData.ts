import { PNG } from 'pngjs/browser';
import type { Atlas } from './atlas';
import type { Frame } from './frame';
import type { Tileset } from './tileset';

export function getAtlasImageUrl(atlas: Atlas): string | undefined {
  if (!atlas.packedImage) {
    return undefined;
  }

  const buffer = PNG.sync.write(atlas.packedImage.pngData, { colorType: 6 });
  const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });

  return URL.createObjectURL(blob);
}

export function getTilesetImageUrl(tileset: Tileset): string {
  const buffer = PNG.sync.write(tileset.image.pngData, { colorType: 6 });
  const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });

  return URL.createObjectURL(blob);
}

export function revokeAtlasImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// Texture Packer JSON array format
export function getJsonData(atlas: Atlas): string {
  const frames: Frame[] = [];

  for (const rect of atlas.packedRects) {
    const image = atlas.images.get(rect.name);
    if (image) {
      frames.push({
        filename: rect.name,
        frame: {
          x: rect.x + Number(image.extrude),
          y: rect.y + Number(image.extrude),
          w: rect.width - Number(image.extrude) * 2,
          h: rect.height - Number(image.extrude) * 2,
        },
        rotated: false,
        trimmed: image.trimmed,
        sourceSize: {
          w: image.sourceWidth,
          h: image.sourceHeight,
        },
        spriteSourceSize: {
          x: image.sourceX,
          y: image.sourceY,
          w: rect.width - Number(image.extrude) * 2,
          h: rect.height - Number(image.extrude) * 2,
        },
      });
    }
  }

  const blob = new Blob([JSON.stringify({ frames }, null, 2)], { type: 'application/json' });

  return URL.createObjectURL(blob);
}
