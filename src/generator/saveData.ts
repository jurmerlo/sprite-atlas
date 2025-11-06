import { PNG } from 'pngjs/browser';
import type { Atlas } from './atlas';
import type { Frame } from './frame';

export function getAtlasImageUrl(atlas: Atlas): string | undefined {
  if (!atlas.packedImage) {
    return undefined;
  }

  const buffer = PNG.sync.write(atlas.packedImage.pngData, { colorType: 6 });
  const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });
  return URL.createObjectURL(blob);
}

export function revokeAtlasImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

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
          width: rect.width - Number(image.extrude) * 2,
          height: rect.height - Number(image.extrude) * 2,
        },
        trimmed: image.trimmed,
        sourceSize: {
          x: image.sourceX,
          y: image.sourceY,
          width: image.sourceWidth,
          height: image.sourceHeight,
        },
      });
    }
  }

  const blob = new Blob([JSON.stringify({ frames }, null, 2)], { type: 'application/json' });

  return URL.createObjectURL(blob);
}
