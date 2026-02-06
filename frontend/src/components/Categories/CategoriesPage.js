import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CategoriesApi, getErrorMessage } from '../../services/api';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { Loader } from '../Common/Loader';

const empty = { name: '', description: '' };

export function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'create', saving: false, id: null, form: empty });
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '', loading: false });

  function refresh() {
    setLoading(true);
    CategoriesApi.list()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setModal({ open: true, mode: 'create', saving: false, id: null, form: empty });
  }

  function openEdit(c) {
    setModal({
      open: true,
      mode: 'edit',
      saving: false,
      id: c.id,
      form: { name: c.name || '', description: c.description || '' },
    });
  }

  async function save() {
    try {
      if (!modal.form.name.trim()) {
        toast.error('Name is required');
        return;
      }
      setModal((m) => ({ ...m, saving: true }));
      if (modal.mode === 'create') {
        await CategoriesApi.create(modal.form);
        toast.success('Category created');
      } else {
        await CategoriesApi.update(modal.id, modal.form);
        toast.success('Category updated');
      }
      setModal({ open: false, mode: 'create', saving: false, id: null, form: empty });
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setModal((m) => ({ ...m, saving: false }));
    }
  }

  function askDelete(c) {
    setConfirm({ open: true, id: c.id, name: c.name, loading: false });
  }

  async function doDelete() {
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await CategoriesApi.remove(confirm.id);
      toast.success('Category deleted');
      setConfirm({ open: false, id: null, name: '', loading: false });
      refresh();
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
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage book categories.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Add Category
        </Button>
      </Stack>

      <Card>
        <CardContent>
          {loading ? (
            <Loader minHeight={220} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{c.name}</TableCell>
                    <TableCell>{c.description || '-'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" gap={1}>
                        <Button size="small" startIcon={<Edit />} onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" startIcon={<Delete />} onClick={() => askDelete(c)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="text.secondary">
                        No categories yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={modal.open} onClose={modal.saving ? undefined : () => setModal((m) => ({ ...m, open: false }))} maxWidth="sm" fullWidth>
        <DialogTitle>{modal.mode === 'create' ? 'Add Category' : 'Edit Category'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack gap={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={modal.form.name}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, name: e.target.value } }))}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={modal.form.description}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, description: e.target.value } }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal((m) => ({ ...m, open: false }))} disabled={modal.saving}>
            Cancel
          </Button>
          <Button onClick={save} variant="contained" startIcon={<Edit />} disabled={modal.saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        title="Delete category?"
        message={`Delete "${confirm.name}"?`}
        confirmText="Delete"
        onClose={() => setConfirm({ open: false, id: null, name: '', loading: false })}
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </Box>
  );
}

