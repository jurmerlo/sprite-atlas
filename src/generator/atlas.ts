import { PNG } from 'pngjs/browser';
import type { AtlasOptions } from '../types.js';
import { AtlasPacker } from './atlasPacker.js';
import { Image } from './image.js';
import { Rectangle } from './rectangle.js';

/**
 * The sprite atlas class holds the image and position data of the individual sprites.
 */
export class Atlas {
  /**
   * The final packed image.
   */
  packedImage: Image | undefined;

  /**
   * The final packed image positions inside the atlas.
   */
  packedRects: Rectangle[] = [];

  /**
   * The images that are in the atlas.
   */
  images = new Map<string, Image>();

  /**
   * The start rectangles.
   */
  rects: Rectangle[] = [];

  /**
   * The file paths to the images.
   */

  private options: AtlasOptions;

  /**
   * Indicates whether an error was found during initialization.
   * If true, the atlas cannot be packed.
   */
  private errorFound = false;

  /**
   * Creates a new atlas instance.
   * @param options The options object for the atlas.
   */
  constructor(options: AtlasOptions) {
    this.options = options;

    for (const file of options.imageFiles) {
      // Load the image and create the rectangle.
      const image = Image.fromBuffer(file.data, options.trimmed, options.extrude);
      this.images.set(file.name, image);
      this.rects.push(new Rectangle(0, 0, image.width, image.height, file.name));
    }
  }

  /**
   * Packs all the images into one image.
   * @returns True if the packing was successful.
   */
  pack(): boolean {
    if (this.errorFound) {
      return false;
    }

    // Perform the actual packing.
    const packer = new AtlasPacker(this.rects, this.options.packMethod, this.options.maxWidth, this.options.maxHeight);

    if (!packer.pack()) {
      return false;
    }

    if (!packer.smallestBounds) {
      return false;
    }

    // Create the final blank image with the correct size.
    this.packedImage = new Image({ width: packer.smallestBounds.width, height: packer.smallestBounds.height });

    // Add all images into the final image.
    for (const rect of packer.smallestLayout) {
      const img = this.images.get(rect.name);
      if (img) {
        PNG.bitblt(img.pngData, this.packedImage.pngData, 0, 0, img.width, img.height, rect.x, rect.y);
      }
    }
    this.packedRects = packer.smallestLayout;

    console.log(`Atlas "${this.options.name}" has been packed successfully.\n`);

    return true;
  }
}
