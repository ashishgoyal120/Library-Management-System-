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
import { UsersApi, getErrorMessage } from '../../services/api';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { Loader } from '../Common/Loader';

const today = () => new Date().toISOString().slice(0, 10);

const empty = {
  name: '',
  email: '',
  phone: '',
  address: '',
  membershipDate: today(),
};

export function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'create', saving: false, id: null, form: empty });
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '', loading: false });

  function refresh() {
    setLoading(true);
    UsersApi.list()
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

  function openEdit(u) {
    setModal({
      open: true,
      mode: 'edit',
      saving: false,
      id: u.id,
      form: {
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        address: u.address || '',
        membershipDate: u.membershipDate || today(),
      },
    });
  }

  async function save() {
    try {
      if (!modal.form.name.trim()) return toast.error('Name is required');
      if (!modal.form.email.trim()) return toast.error('Email is required');
      if (!modal.form.membershipDate) return toast.error('Membership date is required');

      setModal((m) => ({ ...m, saving: true }));
      if (modal.mode === 'create') {
        await UsersApi.create(modal.form);
        toast.success('Member created');
      } else {
        await UsersApi.update(modal.id, modal.form);
        toast.success('Member updated');
      }
      setModal({ open: false, mode: 'create', saving: false, id: null, form: empty });
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setModal((m) => ({ ...m, saving: false }));
    }
  }

  function askDelete(u) {
    setConfirm({ open: true, id: u.id, name: u.name, loading: false });
  }

  async function doDelete() {
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await UsersApi.remove(confirm.id);
      toast.success('Member deleted');
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
            Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage library members.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Add Member
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
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Membership Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone || '-'}</TableCell>
                    <TableCell>{u.membershipDate || '-'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" gap={1}>
                        <Button size="small" startIcon={<Edit />} onClick={() => openEdit(u)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" startIcon={<Delete />} onClick={() => askDelete(u)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No members yet.
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
        <DialogTitle>{modal.mode === 'create' ? 'Add Member' : 'Edit Member'}</DialogTitle>
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
              label="Email"
              value={modal.form.email}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, email: e.target.value } }))}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              value={modal.form.phone}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, phone: e.target.value } }))}
              fullWidth
            />
            <TextField
              label="Address"
              value={modal.form.address}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, address: e.target.value } }))}
              fullWidth
            />
            <TextField
              label="Membership Date"
              type="date"
              value={modal.form.membershipDate}
              onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, membershipDate: e.target.value } }))}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
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
        title="Delete member?"
        message={`Delete "${confirm.name}"?`}
        confirmText="Delete"
        onClose={() => setConfirm({ open: false, id: null, name: '', loading: false })}
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </Box>
  );
}

