import { Add, Delete, Edit, Info } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Pagination,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BooksApi, getErrorMessage } from '../../services/api';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { Loader } from '../Common/Loader';

const DEFAULT_SIZE = 10;

export function BookList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // MUI Pagination is 1-based
  const [size] = useState(DEFAULT_SIZE);
  const [keyword, setKeyword] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [data, setData] = useState({ content: [], totalPages: 1, totalElements: 0 });

  const [confirm, setConfirm] = useState({ open: false, book: null, loading: false });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const p0 = page - 1;
    const k = keyword.trim();
    const req = availableOnly
      ? BooksApi.available(p0, size)
      : k
        ? BooksApi.search(k, p0, size)
        : BooksApi.list(p0, size);

    req
      .then((res) => mounted && setData(res.data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [page, size, keyword, availableOnly]);

  const totalPages = Math.max(1, data?.totalPages ?? 1);

  function openDelete(book) {
    setConfirm({ open: true, book, loading: false });
  }

  function closeDelete() {
    setConfirm({ open: false, book: null, loading: false });
  }

  async function doDelete() {
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await BooksApi.remove(confirm.book.id);
      toast.success('Book deleted');
      closeDelete();
      // refresh
      const p0 = page - 1;
      const k = keyword.trim();
      const req = availableOnly
        ? BooksApi.available(p0, size)
        : k
          ? BooksApi.search(k, p0, size)
          : BooksApi.list(p0, size);
      const res = await req;
      setData(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setConfirm((c) => ({ ...c, loading: false }));
    }
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1.5} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Books
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search, filter, and manage your collection.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<Add />} variant="contained" onClick={() => navigate('/books/new')}>
          Add Book
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5} alignItems={{ md: 'center' }} sx={{ mb: 2 }}>
            <TextField
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, author, category, ISBN..."
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={availableOnly}
                  onChange={(e) => {
                    setAvailableOnly(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="Available only"
            />
          </Stack>

          {loading ? (
            <Loader minHeight={260} />
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Copies</TableCell>
                    <TableCell>ISBN</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content?.map((b) => (
                    <TableRow key={b.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{b.title}</TableCell>
                      <TableCell>{b.authorName || '-'}</TableCell>
                      <TableCell>{b.categoryName || '-'}</TableCell>
                      <TableCell>
                        <Stack direction="row" gap={1} alignItems="center">
                          <Chip
                            size="small"
                            color={b.availableCopies > 0 ? 'success' : 'default'}
                            label={`Available ${b.availableCopies}`}
                          />
                          <Typography variant="body2" color="text.secondary">
                            / {b.totalCopies}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{b.isbn || '-'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" gap={1}>
                          <Button size="small" startIcon={<Info />} onClick={() => navigate(`/books/${b.id}`)}>
                            Details
                          </Button>
                          <Button size="small" startIcon={<Edit />} onClick={() => navigate(`/books/${b.id}/edit`)}>
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => openDelete(b)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!data.content || data.content.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No books found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" sx={{ mt: 2 }} gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Total: {data.totalElements ?? 0}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        title="Delete book?"
        message={`Delete "${confirm.book?.title}"? This cannot be undone.`}
        confirmText="Delete"
        onClose={closeDelete}
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </Box>
  );
}

