import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AppLayout } from './components/Common/AppLayout';
import { Dashboard } from './components/Dashboard';
import { BookDetails } from './components/Books/BookDetails';
import { BookForm } from './components/Books/BookForm';
import { BookList } from './components/Books/BookList';
import { AuthorsPage } from './components/Authors/AuthorsPage';
import { CategoriesPage } from './components/Categories/CategoriesPage';
import { MembersPage } from './components/Members/MembersPage';
import { IssueBookPage } from './components/Borrow/IssueBookPage';
import { ActiveBorrowsPage } from './components/Borrow/ActiveBorrowsPage';
import { OverdueBorrowsPage } from './components/Borrow/OverdueBorrowsPage';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<BookForm mode="create" />} />
            <Route path="/books/:id/edit" element={<BookForm mode="edit" />} />
            <Route path="/books/:id" element={<BookDetails />} />

            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/members" element={<MembersPage />} />

            <Route path="/borrow/issue" element={<IssueBookPage />} />
            <Route path="/borrow/active" element={<ActiveBorrowsPage />} />
            <Route path="/borrow/overdue" element={<OverdueBorrowsPage />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop />
    </ThemeProvider>
  );
}

export default App;
