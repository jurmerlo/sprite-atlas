import type { JSX } from '@emotion/react/jsx-runtime';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import type { ImageFile } from '../types';

export type FileUploadProps = {
  allowMultiple: boolean;
  onFilesSelected: (files: ImageFile[]) => void;
};

// biome-ignore lint/nursery/useExplicitType: Type is clear from usage.
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});



function loadAllFiles(fileList: FileList | null): Promise<ImageFile[]> {
  const files: ImageFile[] = [];
  if (!fileList) {
    return Promise.resolve(files);
  }

  const readFile = (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (result && result instanceof ArrayBuffer) {
          resolve({ name: file.name.split('.')[0], data: result });
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const promises: Promise<ImageFile>[] = [];
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList.item(i);
    if (file) {
      promises.push(readFile(file));
    }
  }

  return Promise.all(promises);
}


export default function FileUpload({ allowMultiple, onFilesSelected }: FileUploadProps): JSX.Element {
  const filesSelected = (fileList: FileList | null): void => {
    loadAllFiles(fileList).then((files) => onFilesSelected(files));
  };
  
  return (
    <Button component="label" role={'button'} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
      Upload files
      <VisuallyHiddenInput
        type="file"
        accept="image/png"
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => filesSelected(event.target.files)}
        multiple={allowMultiple}
      />
    </Button>
  );
}
