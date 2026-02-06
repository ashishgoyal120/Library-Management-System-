import { MenuBook, People, Category, EditNote, Dashboard as DashboardIcon } from '@mui/icons-material';
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

const drawerWidth = 260;

export function AppLayout({ children }) {
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
      { label: 'Issue Book', icon: <MenuBook />, path: '/borrow/issue' },
      { label: 'Active Borrows', icon: <MenuBook />, path: '/borrow/active' },
      { label: 'Overdue', icon: <MenuBook />, path: '/borrow/overdue' },
    ],
    []
  );

  const drawer = (
    <Box sx={{ height: '100%', background: 'white' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Library LMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
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
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{it.icon}</ListItemIcon>
              <ListItemText primary={it.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box className="app-root" sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar sx={{ gap: 1 }}>
          {showSidebar && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen((v) => !v)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <span style={{ fontSize: 18 }}>☰</span>
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Library Management System
          </Typography>
          <Box sx={{ flex: 1 }} />
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.username}
              </Typography>
              <Button size="small" onClick={logout}>
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
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main */}
      <Box component="main" sx={{ flexGrow: 1, p: 2.5, mt: 8, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
}

