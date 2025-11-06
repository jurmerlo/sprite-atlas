import type { Theme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { type JSX, useState } from 'react';
import AtlasMenu from './components/AtlasMenu';
import { revokeAtlasImageUrl } from './generator/saveData';

const drawerWidth = 300;

export default function App(): JSX.Element {
  const [imageSrc, setImageSrc] = useState<string>('');

  const updateImageSrc = (src: string): void => {
    if (imageSrc) {
      revokeAtlasImageUrl(imageSrc);
    }
    setImageSrc(src);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme: Theme): number => theme.zIndex.drawer + 1 }}>
        <Toolbar variant="dense">
          <Typography variant="h6" noWrap component="div">
            Sprite Atlas Generator
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 1, backgroundColor: '#ddd', height: '100vh', overflow: 'auto' }}>
        <Toolbar />
        {imageSrc && <img src={imageSrc} alt="Atlas Preview" />}
      </Box>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2, height: '100vh' }}>
          <AtlasMenu updateImageSrc={updateImageSrc} />
        </Box>
      </Drawer>
    </Box>
  );
}
