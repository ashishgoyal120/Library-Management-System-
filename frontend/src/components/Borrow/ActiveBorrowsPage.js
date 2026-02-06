import { AssignmentTurnedIn } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BorrowApi, getErrorMessage } from '../../services/api';
import { Loader } from '../Common/Loader';

export function ActiveBorrowsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [returningId, setReturningId] = useState(null);

  function refresh() {
    setLoading(true);
    BorrowApi.active()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function doReturn(id) {
    try {
      setReturningId(id);
      await BorrowApi.returnBook(id);
      toast.success('Book returned');
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setReturningId(null);
    }
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1.5} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Active Borrows
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Borrowed books not yet returned.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={refresh} disabled={loading}>
          Refresh
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
                  <TableCell>Book</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Borrow Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {r.bookTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.bookIsbn || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {r.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.userEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>{r.borrowDate || '-'}</TableCell>
                    <TableCell>{r.dueDate || '-'}</TableCell>
                    <TableCell>
                      <Chip size="small" color={r.overdue ? 'warning' : 'primary'} label={r.overdue ? 'OVERDUE' : r.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<AssignmentTurnedIn />}
                        onClick={() => doReturn(r.id)}
                        disabled={returningId === r.id}
                      >
                        Return
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">
                        No active borrows.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

