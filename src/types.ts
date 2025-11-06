export type ImageFile = {
  name: string;
  data: ArrayBuffer;
};

export type PackMethod = 'basic' | 'optimal';

export type AtlasOptions = {
  name: string;
  imageFiles: ImageFile[];
  trimmed: boolean;
  extrude: number;
  packMethod: PackMethod;
  maxWidth: number;
  maxHeight: number;
};

export type TilesetOptions = {
  name: string;
  imageFile: ImageFile;
  tileWidth: number;
  tileHeight: number;
  extrude: number;
};
