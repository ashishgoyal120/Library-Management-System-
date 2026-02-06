import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export function ConfirmDialog({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  loading = false,
}) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

