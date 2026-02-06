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

export function OverdueBorrowsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  function refresh() {
    setLoading(true);
    BorrowApi.overdue()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1.5} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Overdue Borrows
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active borrows past their due date.
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
                      <Chip size="small" color="warning" label="OVERDUE" />
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No overdue borrows.
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

