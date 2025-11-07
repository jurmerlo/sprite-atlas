import { Button, Stack, TextField } from '@mui/material';
import { type JSX, useState } from 'react';
import { getTilesetImageUrl } from '../generator/saveData';
import { Tileset } from '../generator/tileset';
import type { ImageFile } from '../types';
import FileUpload from './FileUpload';

export type TilesetMenuProps = {
  updateImageSrc: (src: string) => void;
};

export default function TilesetMenu({ updateImageSrc }: TilesetMenuProps): JSX.Element {
  const [tilesetSource, setTilesetSource] = useState<ImageFile | null>(null);
  const [tilesetName, setTilesetName] = useState<string>('tiles');
  const [tileWidth, setTileWidth] = useState<number>(32);
  const [tileHeight, setTileHeight] = useState<number>(32);
  const [extrude, setExtrude] = useState<number>(1);
  const [tileset, setTileset] = useState<Tileset | null>(null);
  const [sourceName, setSourceName] = useState<string>('');

  const filesSelected = (files: ImageFile[]): void => {
    if (files.length !== 0) {
      const file = files[0];
      setTilesetSource(file);
      setSourceName(file.name);
    }
  };

  const clear = (): void => {
    setTilesetSource(null);
    setSourceName('');
  };

  const generate = (): void => {
    if (!tilesetSource || tilesetName.trim() === '') {
      return;
    }

    const tileset = new Tileset({
      name: tilesetName,
      imageFile: tilesetSource,
      tileWidth,
      tileHeight,
      extrude,
    });
    setTileset(tileset);

    const imageUrl = getTilesetImageUrl(tileset);
    if (imageUrl) {
      updateImageSrc(imageUrl);
    }
  };

  const download = (): void => {
    if (!tileset) {
      return;
    }

    const imageUrl = getTilesetImageUrl(tileset);
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${tilesetName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <FileUpload allowMultiple={false} label="Upload Tileset" onFilesSelected={filesSelected} />
        <Button variant="outlined" color="primary" onClick={clear} disabled={!tilesetSource}>
          Clear
        </Button>
      </Stack>
      <TextField label="Source" variant="outlined" fullWidth size="small" value={sourceName} disabled />
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        size="small"
        value={tilesetName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTilesetName(e.target.value)}
        required
      />
      <Stack direction="row" spacing={2}>
        <TextField
          type="number"
          label="Tile Width"
          variant="outlined"
          size="small"
          value={tileWidth}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTileWidth(Number(e.target.value))}
        />
        <TextField
          type="number"
          label="Tile Height"
          variant="outlined"
          size="small"
          value={tileHeight}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTileHeight(Number(e.target.value))}
        />
      </Stack>
      <TextField
        type="number"
        label="Extrude"
        variant="outlined"
        size="small"
        value={extrude}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setExtrude(Number(e.target.value))}
      />
      <Stack direction="row" justifyContent="space-around" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={generate}
          size="small"
          disabled={!tilesetSource || tilesetName.trim() === ''}
        >
          Extrude Tileset
        </Button>
        <Button variant="contained" color="primary" onClick={download} size="small" disabled={!tileset}>
          Download
        </Button>
      </Stack>
    </Stack>
  );
}
