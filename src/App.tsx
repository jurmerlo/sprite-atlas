import type { Theme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { type JSX, useState } from 'react';
import AtlasMenu from './components/AtlasMenu';
import TilesetMenu from './components/TilesetMenu';
import { revokeAtlasImageUrl } from './generator/saveData';

const drawerWidth = 300;

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel({ children, value, index, ...other }: TabPanelProps): JSX.Element {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ paddingTop: 2, borderTop: (theme: Theme): string => `1px solid ${theme.palette.divider}` }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number): {
  id: string;
  'aria-controls': string;
} {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function App(): JSX.Element {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

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
        <Toolbar variant="dense" sx={{ alignContent: 'center' }}>
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
        <Box sx={{ overflow: 'auto', paddingLeft: 2, paddingRight: 2, height: '100vh' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="menu tabs">
            <Tab label="Atlas" {...a11yProps(0)} />
            <Tab label="Tileset" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <AtlasMenu updateImageSrc={updateImageSrc} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TilesetMenu updateImageSrc={updateImageSrc} />
          </TabPanel>
        </Box>
      </Drawer>
    </Box>
  );
}
