import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { api } from '../api.js';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .getProperty(id)
      .then(setProperty)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load property: {error}</Alert>;
  }

  if (!property) {
    return <Alert severity="warning">Property not found.</Alert>;
  }

  return (
    <Box>
      <Button component={RouterLink} to="/" sx={{ mb: 2 }}>
        ← Back to all properties
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {property.address}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {property.city}, {property.state} {property.zip}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Field label="Beds" value={property.beds} />
          <Field label="Baths" value={property.baths} />
          <Field label="Sqft" value={property.sqft.toLocaleString()} />
          <Field label="Owner" value={property.ownerName} />
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Enrichment data
        </Typography>
        <Alert severity="info">
          No enrichment data yet. (See <code>CHALLENGE.md</code>.)
        </Alert>
      </Paper>
    </Box>
  );
}

function Field({ label, value }) {
  return (
    <Grid item xs={6} sm={3}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  );
}
