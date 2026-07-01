import { ArrowBack, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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

const fieldSx = {
  '& .MuiInputBase-root': {
    minHeight: 44,
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 280,
    },
  },
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
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 1120, mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        gap={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
            {isEdit ? 'Edit Book' : 'Add Book'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Catalog record
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<ArrowBack />} variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" startIcon={<Save />} variant="contained" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Stack>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Book information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Title, identifiers, author, and category
          </Typography>
        </Box>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 2.5,
              alignItems: 'start',
            }}
          >
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', lg: 'span 2' } }}>
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                fullWidth
                required
                sx={fieldSx}
              />
            </Box>
            <Box>
              <TextField label="ISBN" value={form.isbn} onChange={(e) => setField('isbn', e.target.value)} fullWidth sx={fieldSx} />
            </Box>

            <Box>
              <TextField
                select
                label="Author"
                value={form.authorId}
                onChange={(e) => setField('authorId', e.target.value)}
                fullWidth
                required
                SelectProps={{ MenuProps: selectMenuProps }}
                sx={fieldSx}
              >
                <MenuItem value="" disabled>
                  Select author
                </MenuItem>
                {authors.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                select
                label="Category"
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
                fullWidth
                required
                SelectProps={{ MenuProps: selectMenuProps }}
                sx={fieldSx}
              >
                <MenuItem value="" disabled>
                  Select category
                </MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <TextField
                label="Publisher"
                value={form.publisher}
                onChange={(e) => setField('publisher', e.target.value)}
                fullWidth
                sx={fieldSx}
              />
            </Box>
            <Box>
              <TextField
                label="Publication Year"
                value={form.publicationYear}
                onChange={(e) => setField('publicationYear', e.target.value)}
                fullWidth
                type="number"
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <Divider sx={{ my: 1 }} />
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Inventory
              </Typography>
            </Box>

            <Box>
              <TextField
                label="Total Copies (library owns copies)"
                value={form.totalCopies}
                onChange={(e) => setField('totalCopies', e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                required
                sx={fieldSx}
              />
            </Box>
            <Box>
              <TextField
                label="Available Copies(currently free to borrow)"
                value={form.availableCopies}
                onChange={(e) => setField('availableCopies', e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                required
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                fullWidth
                multiline
                minRows={3}
                sx={fieldSx}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
