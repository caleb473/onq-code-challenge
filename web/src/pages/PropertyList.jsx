import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { api } from '../api.js';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .listProperties()
      .then(setProperties)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load properties: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Properties
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="right">Beds</TableCell>
              <TableCell align="right">Baths</TableCell>
              <TableCell align="right">Sqft</TableCell>
              <TableCell>Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Link component={RouterLink} to={`/properties/${p.id}`}>
                    {p.address}
                  </Link>
                </TableCell>
                <TableCell>{p.city}</TableCell>
                <TableCell>{p.state}</TableCell>
                <TableCell align="right">{p.beds}</TableCell>
                <TableCell align="right">{p.baths}</TableCell>
                <TableCell align="right">{p.sqft.toLocaleString()}</TableCell>
                <TableCell>{p.ownerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
