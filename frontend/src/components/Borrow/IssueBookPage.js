import { CheckCircle } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BorrowApi, BooksApi, UsersApi, getErrorMessage } from '../../services/api';
import { Loader } from '../Common/Loader';

export function IssueBookPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  const [form, setForm] = useState({ userId: '', bookId: '', dueDays: 14 });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([UsersApi.list(), BooksApi.available(0, 200)])
      .then(([uRes, bRes]) => {
        if (!mounted) return;
        setMembers(uRes.data || []);
        setBooks(bRes.data?.content || []);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function issue(e) {
    e.preventDefault();
    try {
      if (!form.userId) return toast.error('Member is required');
      if (!form.bookId) return toast.error('Book is required');
      setSaving(true);
      await BorrowApi.issue({ userId: Number(form.userId), bookId: Number(form.bookId), dueDays: Number(form.dueDays) });
      toast.success('Book issued');
      // refresh available books
      const bRes = await BooksApi.available(0, 200);
      setBooks(bRes.data?.content || []);
      setForm({ userId: '', bookId: '', dueDays: 14 });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader minHeight={260} />;

  return (
    <Box component="form" onSubmit={issue}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1.5} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Issue a Book
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a member and an available book.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button type="submit" variant="contained" startIcon={<CheckCircle />} disabled={saving}>
          Issue
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Member"
                value={form.userId}
                onChange={(e) => setField('userId', e.target.value)}
                fullWidth
                required
              >
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Book"
                value={form.bookId}
                onChange={(e) => setField('bookId', e.target.value)}
                fullWidth
                required
              >
                {books.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.title} — {b.authorName} (Available: {b.availableCopies})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Due Days"
                type="number"
                inputProps={{ min: 1 }}
                value={form.dueDays}
                onChange={(e) => setField('dueDays', e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

