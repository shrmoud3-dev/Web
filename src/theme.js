import { createTheme } from '@mui/material/styles'

// Material UI theme — keeps the original sagarika.work palette and type:
// Bricolage Grotesque headings, Karla body, warm ink, terracotta accent.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e1c1b', contrastText: '#f1f1f1' },
    secondary: { main: '#b4552d', contrastText: '#ffffff' },
    background: { default: '#f1f1f1', paper: '#ffffff' },
    text: { primary: '#1e1c1b', secondary: '#727272' },
    divider: '#d4d4d4',
  },
  typography: {
    fontFamily: "'Karla', -apple-system, 'Segoe UI', sans-serif",
    h1: { fontFamily: "'Bricolage Grotesque', 'Karla', sans-serif", fontWeight: 700, lineHeight: 1.15 },
    h2: { fontFamily: "'Bricolage Grotesque', 'Karla', sans-serif", fontWeight: 700, lineHeight: 1.15 },
    h3: { fontFamily: "'Bricolage Grotesque', 'Karla', sans-serif", fontWeight: 700, lineHeight: 1.15 },
    h4: { fontFamily: "'Bricolage Grotesque', 'Karla', sans-serif", fontWeight: 700, lineHeight: 1.15 },
    h5: { fontFamily: "'Bricolage Grotesque', 'Karla', sans-serif", fontWeight: 700, lineHeight: 1.15 },
    h6: { fontFamily: "'Bricolage Grotesque', 'Karla', sans-serif", fontWeight: 700, lineHeight: 1.15 },
    body1: { fontSize: '18px', lineHeight: 1.65 },
    body2: { fontSize: '16px', lineHeight: 1.6 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700, borderRadius: 999 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
  },
})
