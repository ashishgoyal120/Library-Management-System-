import { CssBaseline, ThemeProvider } from '@mui/material';
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppInner() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <RegisterPage />
              </PublicOnly>
            }
          />

          <Route
            element={
              <RequireAuth>
                <AppLayout>
                  <Outlet />
                </AppLayout>
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/books"
              element={<BookList />}
            />
            <Route
              path="/books/new"
              element={<BookForm mode="create" />}
            />
            <Route
              path="/books/:id/edit"
              element={<BookForm mode="edit" />}
            />
            <Route
              path="/books/:id"
              element={<BookDetails />}
            />

            <Route
              path="/authors"
              element={<AuthorsPage />}
            />
            <Route
              path="/categories"
              element={<CategoriesPage />}
            />
            <Route
              path="/members"
              element={<MembersPage />}
            />

            <Route
              path="/borrow/issue"
              element={<IssueBookPage />}
            />
            <Route
              path="/borrow/active"
              element={<ActiveBorrowsPage />}
            />
            <Route
              path="/borrow/overdue"
              element={<OverdueBorrowsPage />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>

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
