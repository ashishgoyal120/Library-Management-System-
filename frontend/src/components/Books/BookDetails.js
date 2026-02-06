import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BooksApi, BorrowApi, getErrorMessage } from '../../services/api';
import { Loader } from '../Common/Loader';

export function BookDetails() {
  const { id } = useParams();
  const bookId = Number(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([BooksApi.get(bookId), BorrowApi.bookHistory(bookId)])
      .then(([bRes, hRes]) => {
        if (!mounted) return;
        setBook(bRes.data);
        setHistory(hRes.data || []);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [bookId]);

  if (loading) return <Loader minHeight={260} />;

  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Book Details
        </Typography>
      </Stack>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ md: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {book?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {book?.authorName} • {book?.categoryName}
              </Typography>
              {book?.description ? (
                <Typography variant="body2" sx={{ mt: 1.5 }}>
                  {book.description}
                </Typography>
              ) : null}
            </Box>

            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip label={`ISBN: ${book?.isbn || '-'}`} />
              <Chip label={`Publisher: ${book?.publisher || '-'}`} />
              <Chip label={`Year: ${book?.publicationYear ?? '-'}`} />
              <Chip
                color={book?.availableCopies > 0 ? 'success' : 'default'}
                label={`Available: ${book?.availableCopies ?? 0} / ${book?.totalCopies ?? 0}`}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Borrow History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All issues/returns for this book.
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {h.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {h.userEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>{h.borrowDate || '-'}</TableCell>
                  <TableCell>{h.dueDate || '-'}</TableCell>
                  <TableCell>{h.returnDate || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={h.overdue ? 'warning' : h.status === 'RETURNED' ? 'default' : 'primary'}
                      label={h.overdue ? 'OVERDUE' : h.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary">
                      No borrow history yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}

