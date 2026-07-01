import {
  AssignmentReturn,
  Category,
  Dashboard as DashboardIcon,
  EditNote,
  LibraryAdd,
  Menu,
  MenuBook,
  People,
  WarningAmber,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '../../AuthContext';
import { ThemeModeToggle } from './ThemeModeToggle';

const drawerWidth = 260;

export function AppLayout({ children, themeMode, onToggleThemeMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const showSidebar = !!user;

  const items = useMemo(
    () => [
      { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { label: 'Books', icon: <MenuBook />, path: '/books' },
      { label: 'Authors', icon: <EditNote />, path: '/authors' },
      { label: 'Categories', icon: <Category />, path: '/categories' },
      { label: 'Members', icon: <People />, path: '/members' },
      { label: 'Issue Book', icon: <LibraryAdd />, path: '/borrow/issue' },
      { label: 'Active Borrows', icon: <AssignmentReturn />, path: '/borrow/active' },
      { label: 'Overdue', icon: <WarningAmber />, path: '/borrow/overdue' },
    ],
    []
  );

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
      <Toolbar sx={{ px: 3, minHeight: { xs: 64, sm: 72 } }}>
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0 }}>
          Library LMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {items.map((it) => {
          const selected = location.pathname === it.path || location.pathname.startsWith(it.path + '/');
          return (
            <ListItemButton
              key={it.path}
              selected={selected}
              onClick={() => {
                navigate(it.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                my: 0.5,
                minHeight: 46,
                color: selected ? 'primary.dark' : 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: themeMode === 'dark' ? 'rgba(37, 99, 235, 0.22)' : '#eef4ff',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: themeMode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : '#e5efff',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{it.icon}</ListItemIcon>
              <ListItemText
                primary={it.label}
                primaryTypographyProps={{ fontWeight: selected ? 800 : 600, fontSize: 15 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box className="app-root" sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          width: { md: showSidebar ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: showSidebar ? `${drawerWidth}px` : 0 },
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          {showSidebar && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen((v) => !v)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <Menu fontSize="small" />
            </IconButton>
          )}
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 800, lineHeight: 1.2, minWidth: 0, flexShrink: 1, letterSpacing: 0 }}
          >
            Library Management System
          </Typography>
          <Box sx={{ flex: 1 }} />
          <ThemeModeToggle themeMode={themeMode} onToggleThemeMode={onToggleThemeMode} />
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.username}
              </Typography>
              <Button size="small" onClick={logout} sx={{ px: 1.5 }}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button size="small" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar (only when logged in) */}
      {showSidebar && (
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'background.paper' },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'background.paper' },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 2.5, sm: 3 },
          mt: 8,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
