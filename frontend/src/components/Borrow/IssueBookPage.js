import { CheckCircle } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BorrowApi, BooksApi, UsersApi, getErrorMessage } from '../../services/api';
import { Loader } from '../Common/Loader';

const fieldSx = {
  '& .MuiInputBase-root': {
    minHeight: 44,
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 320,
      minWidth: 320,
    },
  },
};

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
    <Box component="form" onSubmit={issue} sx={{ maxWidth: 1120, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1.5} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
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

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Borrow details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Member, book, and due date
          </Typography>
        </Box>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(260px, 1fr) minmax(320px, 1.35fr) minmax(160px, 0.45fr)',
              },
              gap: 2.5,
              alignItems: 'start',
            }}
          >
            <Box>
              <TextField
                select
                label="Member"
                value={form.userId}
                onChange={(e) => setField('userId', e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: selectMenuProps,
                  renderValue: (selected) => {
                    const member = members.find((m) => m.id === Number(selected));
                    return member ? `${member.name} (${member.email})` : <Typography color="text.secondary">Select member</Typography>;
                  },
                }}
                sx={fieldSx}
              >
                <MenuItem value="" disabled>
                  Select member
                </MenuItem>
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                select
                label="Book"
                value={form.bookId}
                onChange={(e) => setField('bookId', e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: selectMenuProps,
                  renderValue: (selected) => {
                    const book = books.find((b) => b.id === Number(selected));
                    return book ? `${book.title} - ${book.authorName || 'Unknown author'} (${book.availableCopies} available)` : <Typography color="text.secondary">Select available book</Typography>;
                  },
                }}
                sx={fieldSx}
              >
                <MenuItem value="" disabled>
                  Select available book
                </MenuItem>
                {books.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {b.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {b.authorName || 'Unknown author'} · {b.availableCopies} available
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                label="Due Days"
                type="number"
                inputProps={{ min: 1 }}
                value={form.dueDays}
                onChange={(e) => setField('dueDays', e.target.value)}
                fullWidth
                sx={fieldSx}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
