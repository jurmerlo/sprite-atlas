import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { type JSX, useState } from 'react';
import { Atlas } from '../generator/atlas';
import { getAtlasImageUrl, getJsonData } from '../generator/saveData';
import type { ImageFile, PackMethod } from '../types';
import FileList from './FileList';
import FileUpload from './FileUpload';

export type AtlasMenuProps = {
  updateImageSrc: (src: string) => void;
};

export default function AtlasMenu({ updateImageSrc }: AtlasMenuProps): JSX.Element {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [packMethod, setPackMethod] = useState<PackMethod>('optimal');
  const [atlasName, setAtlasName] = useState<string>('sprites');
  const [extrude, setExtrude] = useState<number>(1);
  const [trimmed, setTrimmed] = useState<boolean>(true);
  const [maxWidth, setMaxWidth] = useState<number>(4096);
  const [maxHeight, setMaxHeight] = useState<number>(4096);
  const [atlas, setAtlas] = useState<Atlas | null>(null);

  const filesSelected = (files: ImageFile[]): void => {
    setFiles(files);
  };

  const generate = (): void => {
    if (files.length === 0 || atlasName.trim() === '') {
      return;
    }

    const atlas = new Atlas({
      name: atlasName,
      imageFiles: files,
      trimmed,
      extrude,
      packMethod,
      maxWidth,
      maxHeight,
    });
    atlas.pack();
    setAtlas(atlas);
    const imageUrl = getAtlasImageUrl(atlas);
    if (imageUrl) {
      updateImageSrc(imageUrl);
    }
  };

  const download = (): void => {
    if (!atlas) {
      return;
    }

    const imageUrl = getAtlasImageUrl(atlas);
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${atlasName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      const jsonUrl = getJsonData(atlas);
      if (jsonUrl) {
        const link = document.createElement('a');
        link.href = jsonUrl;
        link.download = `${atlasName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 500);
  }

  return (
    <Stack spacing={2}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <FileUpload allowMultiple={true} onFilesSelected={filesSelected} />
      <Button variant="outlined" color="secondary" onClick={(): void => setFiles([])} disabled={files.length === 0}>
        Clear
      </Button>
      </Stack>
      <FileList
        files={files}
        onDelete={(index: number): void => {
          setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
          updateImageSrc('');
        }}
      />
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        size="small"
        value={atlasName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAtlasName(e.target.value)}
        required
      />
      <Stack direction="row" spacing={2}>
        <TextField
          type="number"
          label="Extrude"
          variant="outlined"
          size="small"
          value={extrude}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setExtrude(Number(e.target.value))}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={trimmed}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTrimmed(e.target.checked)}
              />
            }
            label="Trimmed"
          />
        </FormGroup>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          type="number"
          label="Max Width"
          variant="outlined"
          size="small"
          value={maxWidth}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setMaxWidth(Number(e.target.value))}
        />
        <TextField
          type="number"
          label="Max Height"
          variant="outlined"
          size="small"
          value={maxHeight}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setMaxHeight(Number(e.target.value))}
        />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="subtitle1">Pack Method</Typography>
        <ToggleButtonGroup
          value={packMethod}
          exclusive
          onChange={(_: React.MouseEvent<HTMLElement>, newPackMethod: PackMethod): void => setPackMethod(newPackMethod)}
          aria-label="pack method"
        >
          <ToggleButton color="primary" value="basic" size="small">
            Basic
          </ToggleButton>
          <ToggleButton color="primary" value="optimal" size="small">
            Optimal
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" justifyContent="space-around" alignItems="center">
      <Button variant="contained" color="primary" onClick={generate} size='small' disabled={files.length === 0 || atlasName.trim() === ''}>
        Generate Atlas
      </Button>
      <Button variant="contained" color="primary" onClick={download} size='small' disabled={!atlas}>
        Download
      </Button>

      </Stack>
    </Stack>
  );
}
