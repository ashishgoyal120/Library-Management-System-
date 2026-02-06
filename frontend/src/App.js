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
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { theme } from './theme';
import { AuthProvider, useAuth } from './AuthContext';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppInner() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            <Route
              path="/books"
              element={
                <RequireAuth>
                  <BookList />
                </RequireAuth>
              }
            />
            <Route
              path="/books/new"
              element={
                <RequireAuth>
                  <BookForm mode="create" />
                </RequireAuth>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <RequireAuth>
                  <BookForm mode="edit" />
                </RequireAuth>
              }
            />
            <Route
              path="/books/:id"
              element={
                <RequireAuth>
                  <BookDetails />
                </RequireAuth>
              }
            />

            <Route
              path="/authors"
              element={
                <RequireAuth>
                  <AuthorsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/categories"
              element={
                <RequireAuth>
                  <CategoriesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/members"
              element={
                <RequireAuth>
                  <MembersPage />
                </RequireAuth>
              }
            />

            <Route
              path="/borrow/issue"
              element={
                <RequireAuth>
                  <IssueBookPage />
                </RequireAuth>
              }
            />
            <Route
              path="/borrow/active"
              element={
                <RequireAuth>
                  <ActiveBorrowsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/borrow/overdue"
              element={
                <RequireAuth>
                  <OverdueBorrowsPage />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop />
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
