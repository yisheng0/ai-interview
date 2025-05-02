import { Components } from '@mui/material/styles';

// 组件样式定制
export const components: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
      },
      sizeSmall: {
        padding: '6px 16px',
      },
      sizeMedium: {
        padding: '8px 20px',
      },
      sizeLarge: {
        padding: '10px 22px',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 20,
        '&:last-child': {
          paddingBottom: 20,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.12)',
      },
    },
  },
}; 