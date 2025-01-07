// themeConfig.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define your theme configuration
const themeOptions: ThemeOptions = {
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#3c4049', // Modify the tooltip background color here
          color: '#ffffff', // Modify the tooltip text color here
          fontFamily: 'Inter, Helvetica, sans-serif', // Modify the tooltip font family here
          fontWeight: 300, // Modify the tooltip font weight here
          fontSize: '12px', // Modify the tooltip font size here
        },
        arrow: {
          color: '#3c4049', // Modify the tooltip arrow color here
        },
      },
    },
  },
};

// Create the theme
const theme = createTheme(themeOptions);

export default theme;
