import { PNG } from 'pngjs/browser';
import type { TilesetOptions } from '../types.js';
import { Image } from './image.js';

export class Tileset {
  image: Image;

  constructor({ imageFile, tileWidth, tileHeight, extrude }: TilesetOptions) {
    const sourceImage = Image.fromBuffer(imageFile.data, false, 0);
    const horizontalTiles = Math.floor(sourceImage.width / tileWidth);
    const verticalTiles = Math.floor(sourceImage.height / tileHeight);

    const tiles: Image[][] = [];
    for (let y = 0; y < verticalTiles; y++) {
      const row: Image[] = [];
      for (let x = 0; x < horizontalTiles; x++) {
        const tileX = x * tileWidth;
        const tileY = y * tileHeight;
        const tileImage = new Image({ width: tileWidth, height: tileHeight });

        PNG.bitblt(sourceImage.pngData, tileImage.pngData, tileX, tileY, tileWidth, tileHeight);
        tileImage.extrudeEdges(extrude ?? 0);

        row.push(tileImage);
      }
      if (row.length > 0) {
        tiles.push(row);
      }
    }

    let horizontalTileCount = 0;
    for (const row of tiles) {
      // Remove trailing empty tiles.
      for (let x = row.length - 1; x >= 0; x--) {
        if (row[x].isEmpty()) {
          row.pop();
        } else {
          break;
        }
      }

      if (row.length > horizontalTileCount) {
        horizontalTileCount = row.length;
      }
    }

    for (let y = tiles.length - 1; y >= 0; y--) {
      // Remove trailing empty rows.
      if (tiles[y].length === 0) {
        tiles.pop();
      } else {
        break;
      }
    }
    const verticalTileCount = tiles.length;

    const totalExtrude = extrude * 2;

    this.image = new Image({
      width: horizontalTileCount * (tileWidth + totalExtrude),
      height: verticalTileCount * (tileHeight + totalExtrude),
    });

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tileImage = tiles[y][x];
        const destX = x * tileImage.width;
        const destY = y * tileImage.height;

        PNG.bitblt(tileImage.pngData, this.image.pngData, 0, 0, tileImage.width, tileImage.height, destX, destY);
      }
    }
  }
}
