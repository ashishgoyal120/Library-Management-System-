import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DashboardApi, getErrorMessage } from '../services/api';
import { Loader } from './Common/Loader';

function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    DashboardApi.stats()
      .then((res) => {
        if (!mounted) return;
        setStats(res.data);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader minHeight={260} />;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Total Books" value={stats?.totalBooksCount ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Available Books" value={stats?.availableBooksCount ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Borrowed Books" value={stats?.borrowedBooksCount ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Total Members" value={stats?.totalMembersCount ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard label="Overdue Borrows" value={stats?.overdueBooksCount ?? 0} />
        </Grid>
      </Grid>
    </Box>
  );
}

