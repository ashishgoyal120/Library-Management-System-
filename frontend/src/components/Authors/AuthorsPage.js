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
import { AuthorsApi, getErrorMessage } from '../../services/api';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { Loader } from '../Common/Loader';

const empty = { name: '', bio: '' };

export function AuthorsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'create', saving: false, id: null, form: empty });
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '', loading: false });

  function refresh() {
    setLoading(true);
    AuthorsApi.list()
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

  function openEdit(a) {
    setModal({ open: true, mode: 'edit', saving: false, id: a.id, form: { name: a.name || '', bio: a.bio || '' } });
  }

  async function save() {
    try {
      if (!modal.form.name.trim()) {
        toast.error('Name is required');
        return;
      }
      setModal((m) => ({ ...m, saving: true }));
      if (modal.mode === 'create') {
        await AuthorsApi.create(modal.form);
        toast.success('Author created');
      } else {
        await AuthorsApi.update(modal.id, modal.form);
        toast.success('Author updated');
      }
      setModal({ open: false, mode: 'create', saving: false, id: null, form: empty });
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setModal((m) => ({ ...m, saving: false }));
    }
  }

  function askDelete(a) {
    setConfirm({ open: true, id: a.id, name: a.name, loading: false });
  }

  async function doDelete() {
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await AuthorsApi.remove(confirm.id);
      toast.success('Author deleted');
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
            Authors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage authors.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Add Author
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
                  <TableCell>Bio</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{a.name}</TableCell>
                    <TableCell>{a.bio || '-'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" gap={1}>
                        <Button size="small" startIcon={<Edit />} onClick={() => openEdit(a)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" startIcon={<Delete />} onClick={() => askDelete(a)}>
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
                        No authors yet.
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
        <DialogTitle>{modal.mode === 'create' ? 'Add Author' : 'Edit Author'}</DialogTitle>
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
              label="Bio"
              value={modal.form.bio}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, bio: e.target.value } }))}
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
        title="Delete author?"
        message={`Delete "${confirm.name}"?`}
        confirmText="Delete"
        onClose={() => setConfirm({ open: false, id: null, name: '', loading: false })}
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </Box>
  );
}

