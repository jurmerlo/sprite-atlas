import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import type { JSX } from 'react';
import type { ImageFile } from '../types';

export type FileListProps = {
  files: ImageFile[];
  onDelete: (index: number) => void;
};

export default function FileList({ files, onDelete }: FileListProps): JSX.Element {
  return (
    <List
      dense
      sx={{
        height: 300,
        overflow: 'auto',
        border: '1px solid #ccc',
        borderRadius: 1,
      }}
    >
      {files.map((file, index) => (
        <ListItem
          key={file.name}
          secondaryAction={
            <IconButton edge="end" onClick={(): void => onDelete(index)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          {file.name}
        </ListItem>
      ))}
    </List>
  );
}
