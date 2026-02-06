import { Save } from '@mui/icons-material';
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
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthorsApi, BooksApi, CategoriesApi, getErrorMessage } from '../../services/api';
import { Loader } from '../Common/Loader';

const empty = {
  title: '',
  isbn: '',
  publisher: '',
  publicationYear: '',
  totalCopies: 1,
  availableCopies: 1,
  description: '',
  authorId: '',
  categoryId: '',
};

export function BookForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit';
  const bookId = useMemo(() => (isEdit ? Number(id) : null), [id, isEdit]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([AuthorsApi.list(), CategoriesApi.list(), isEdit ? BooksApi.get(bookId) : Promise.resolve(null)])
      .then(([aRes, cRes, bRes]) => {
        if (!mounted) return;
        setAuthors(aRes.data || []);
        setCategories(cRes.data || []);
        if (bRes) {
          const b = bRes.data;
          setForm({
            title: b.title || '',
            isbn: b.isbn || '',
            publisher: b.publisher || '',
            publicationYear: b.publicationYear ?? '',
            totalCopies: b.totalCopies ?? 0,
            availableCopies: b.availableCopies ?? 0,
            description: b.description || '',
            authorId: b.authorId ?? '',
            categoryId: b.categoryId ?? '',
          });
        } else {
          setForm(empty);
        }
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [bookId, isEdit]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        publicationYear: form.publicationYear === '' ? null : Number(form.publicationYear),
        totalCopies: Number(form.totalCopies),
        availableCopies: Number(form.availableCopies),
        authorId: Number(form.authorId),
        categoryId: Number(form.categoryId),
      };
      if (!payload.title?.trim()) {
        toast.error('Title is required');
        return;
      }
      if (!payload.authorId) {
        toast.error('Author is required');
        return;
      }
      if (!payload.categoryId) {
        toast.error('Category is required');
        return;
      }

      if (isEdit) {
        await BooksApi.update(bookId, payload);
        toast.success('Book updated');
      } else {
        await BooksApi.create(payload);
        toast.success('Book created');
      }
      navigate('/books');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader minHeight={260} />;

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1.5} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {isEdit ? 'Edit Book' : 'Add Book'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the book details and save.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" startIcon={<Save />} variant="contained" disabled={saving}>
          Save
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="ISBN" value={form.isbn} onChange={(e) => setField('isbn', e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Publication Year"
                value={form.publicationYear}
                onChange={(e) => setField('publicationYear', e.target.value)}
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Author"
                value={form.authorId}
                onChange={(e) => setField('authorId', e.target.value)}
                fullWidth
                required
              >
                {authors.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Category"
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
                fullWidth
                required
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Publisher"
                value={form.publisher}
                onChange={(e) => setField('publisher', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Total Copies"
                value={form.totalCopies}
                onChange={(e) => setField('totalCopies', e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Available Copies"
                value={form.availableCopies}
                onChange={(e) => setField('availableCopies', e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

