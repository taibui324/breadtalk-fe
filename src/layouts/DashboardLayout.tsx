import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Collapse,
  Badge,
  Chip,
  Tooltip,
  alpha,
  Paper,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  History as HistoryIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  to: string;
  subItems?: Array<{
    title: string;
    to: string;
  }>;
}

// Navigation groups based on user roles
const hqNavItems: NavItemProps[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    to: '/',
  },
  {
    title: 'Delivery',
    icon: <ShippingIcon />,
    to: '/hq/delivery',
    subItems: [
      { title: 'Send Ingredient', to: '/hq/send-ingredient' },
      { title: 'Send Product', to: '/hq/send-product' },
      { title: 'Order History', to: '/hq/order-history' },
    ],
  },
  {
    title: 'Inventory',
    icon: <InventoryIcon />,
    to: '/hq/inventory',
    subItems: [
      { title: 'Ingredient List', to: '/hq/ingredient-list' },
      { title: 'Production List', to: '/hq/production-list' },
    ],
  },
  {
    title: 'Database',
    icon: <RestaurantIcon />,
    to: '/hq/database',
    subItems: [
      { title: 'Ingredients', to: '/hq/ingredient-database' },
      { title: 'Semi Products', to: '/hq/semi-products-database' },
      { title: 'Products', to: '/hq/products-database' },
    ],
  },
  {
    title: 'Administration',
    icon: <PeopleIcon />,
    to: '/hq/admin',
    subItems: [
      { title: 'Employee Management', to: '/hq/employee-management' },
      { title: 'Store Management', to: '/hq/store-management' },
      { title: 'Statistics', to: '/hq/statistics' },
    ],
  },
];

const centralKitchenNavItems: NavItemProps[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    to: '/',
  },
  {
    title: 'Delivery',
    icon: <ShippingIcon />,
    to: '/central-kitchen/delivery',
    subItems: [
      { title: 'Receive Order', to: '/central-kitchen/receive-order' },
      { title: 'Order History', to: '/central-kitchen/order-history' },
    ],
  },
  {
    title: 'Production',
    icon: <RestaurantIcon />,
    to: '/central-kitchen/production',
    subItems: [
      { title: 'Today\'s Production', to: '/central-kitchen/production-list' },
      { title: 'Daily Production', to: '/central-kitchen/daily-production' },
    ],
  },
  {
    title: 'Inventory',
    icon: <InventoryIcon />,
    to: '/central-kitchen/inventory',
  },
];

const storeNavItems: NavItemProps[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    to: '/',
  },
  {
    title: 'Delivery',
    icon: <ShippingIcon />,
    to: '/store/delivery',
    subItems: [
      { title: 'Receive Order', to: '/store/receive-order' },
      { title: 'Order History', to: '/store/order-history' },
    ],
  },
  {
    title: 'Production',
    icon: <RestaurantIcon />,
    to: '/store/production',
    subItems: [
      { title: 'Today\'s Production', to: '/store/production-list' },
      { title: 'Daily Production', to: '/store/daily-production' },
    ],
  },
  {
    title: 'Inventory',
    icon: <InventoryIcon />,
    to: '/store/inventory',
  },
];

// Choose navigation items based on user role
const getNavItemsByRole = (role: string) => {
  switch (role) {
    case "hq":
      return hqNavItems;
    case "central-kitchen":
      return centralKitchenNavItems;
    case "store":
      return storeNavItems;
    default:
      return hqNavItems;
  }
};

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const navItems = getNavItemsByRole(user?.role || 'hq');

  // Close drawer on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleExpandClick = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const toggleColorMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const getGroupExpanded = (groupTitle: string) => {
    const hasOpenSubItem = navItems
      .filter(item => item.title === groupTitle && item.subItems)
      .some(item =>
        item.subItems?.some(subItem => location.pathname === subItem.to)
      );

    return expandedItems[groupTitle] || hasOpenSubItem;
  };

  // Get role color
  const getRoleColor = () => {
    switch (user?.role) {
      case 'hq':
        return theme.palette.primary.main;
      case 'central-kitchen':
        return theme.palette.success.main;
      case 'store':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Get role display text
  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'hq':
        return 'Headquarters';
      case 'central-kitchen':
        return 'Central Kitchen';
      case 'store':
        return 'Store Manager';
      default:
        return 'User';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: { md: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { md: `${drawerWidth}px` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ height: 64, px: { xs: 2, md: 3 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, ...(open && { display: { md: 'none' } }) }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Search */}
          <IconButton
            size="large"
            color="inherit"
            sx={{ ml: 1 }}
          >
            <SearchIcon />
          </IconButton>

          {/* Light/Dark Mode Toggle */}
          <IconButton
            size="large"
            color="inherit"
            onClick={toggleColorMode}
            sx={{ ml: 1 }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              onClick={handleOpenNotifications}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            sx={{ mt: 1.5 }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                width: 320,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
            </Box>
            <Divider />
            <List sx={{ p: 0 }}>
              <ListItem sx={{ py: 2, px: 2.5 }}>
                <ListItemText 
                  primary="Low stock alert: Flour" 
                  secondary="Central Kitchen is running low on flour"
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ py: 2, px: 2.5 }}>
                <ListItemText 
                  primary="New order received" 
                  secondary="Order #123 has been received"
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </List>
            <Divider />
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography 
                variant="subtitle2" 
                component="button"
                onClick={() => {
                  handleCloseNotifications();
                }}
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' },
                  border: 'none',
                  background: 'none',
                  width: '100%',
                  p: 1,
                }}
              >
                View all notifications
              </Typography>
            </Box>
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ height: 32, mx: 2 }} />

          {/* User Menu */}
          <Box 
            onClick={handleOpenUserMenu}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
              py: 1,
              px: 0.5,
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: getRoleColor(),
                width: 40,
                height: 40,
                mr: 1,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getRoleDisplay()}
              </Typography>
            </Box>
          </Box>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            sx={{ mt: 1.5 }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                width: 200,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: 'none',
            border: 'none',
            backgroundColor: theme.palette.mode === 'light' 
              ? alpha(theme.palette.primary.main, 0.03)
              : alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        <Box sx={{ px: 2, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'primary.main', 
                color: 'white',
                mr: 1,
              }}
            >
              B
            </Avatar>
            <Typography variant="h6" noWrap component="div" fontWeight="bold">
              BreadTalk
            </Typography>
          </Box>
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* User Info */}
        <Box 
          sx={{ 
            px: 2, 
            pt: 2, 
            pb: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: getRoleColor(),
                width: 40,
                height: 40,
                mr: 1.5,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getRoleDisplay()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 1 }} />

        {/* Navigation */}
        <List component="nav" sx={{ px: 1, py: 2 }}>
          {navItems.map((item) => (
            <Box key={item.title}>
              {item.subItems ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleExpandClick(item.title)}
                      sx={{
                        minHeight: 48,
                        borderRadius: 1,
                        mb: 0.5,
                        px: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          fontWeight: 500,
                        }} 
                      />
                      {getGroupExpanded(item.title) ? (
                        <ExpandLess fontSize="small" color="action" />
                      ) : (
                        <ExpandMore fontSize="small" color="action" />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={getGroupExpanded(item.title)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.title} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(subItem.to)}
                            selected={isSelected(subItem.to)}
                            sx={{
                              height: 40,
                              ml: 2,
                              borderRadius: 1,
                              mb: 0.5,
                              pl: 4,
                              '&.Mui-selected': {
                                bgcolor: 'primary.lighter',
                                '&:hover': {
                                  bgcolor: 'primary.lighter',
                                },
                                '& .MuiTypography-root': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                          >
                            <ListItemText 
                              primary={subItem.title} 
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                fontWeight: isSelected(subItem.to) ? 600 : 400,
                              }} 
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.to)}
                    selected={isSelected(item.to)}
                    sx={{
                      minHeight: 48,
                      borderRadius: 1,
                      mb: 0.5,
                      px: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.lighter',
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                        '& .MuiTypography-root': {
                          color: 'primary.main',
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isSelected(item.to) ? 'primary.main' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        fontWeight: isSelected(item.to) ? 600 : 500,
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </Box>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          pb: 2,
          px: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
