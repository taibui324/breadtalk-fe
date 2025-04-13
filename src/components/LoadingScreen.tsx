import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
}
