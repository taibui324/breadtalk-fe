import { Box, Typography, Grid, Card, CardContent, Button, Stack, Divider, Avatar, List, ListItem, ListItemText, ListItemAvatar, Paper, IconButton, alpha, Container, LinearProgress, useTheme } from '@mui/material';
import {
  LocalShipping,
  Inventory,
  Restaurant,
  TrendingUp,
  Warning,
  AddCircleOutline,
  Sync,
  Visibility,
  CheckCircleOutline,
  AccessTime,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Inventory2
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Sample data for the dashboard
const summaryData = [
  { id: 'total-orders', title: 'Total Orders', value: '124', change: '+12%', icon: <LocalShipping />, color: '#5e35b1' },
  { id: 'ingredients', title: 'Ingredients', value: '86', change: '-5%', icon: <Inventory />, color: '#00897b' },
  { id: 'production', title: 'Today\'s Production', value: '243', change: '+24%', icon: <Restaurant />, color: '#e53935' },
  { id: 'stock-value', title: 'Stock Value', value: '$12,850', change: '+8%', icon: <TrendingUp />, color: '#f57c00' },
];

const lowStockItems = [
  { id: 'flour', name: 'Flour', quantity: '5 kg', threshold: '10 kg', store: 'Central Kitchen', percentage: 50 },
  { id: 'sugar', name: 'Sugar', quantity: '3 kg', threshold: '8 kg', store: 'Store #2', percentage: 37.5 },
  { id: 'butter', name: 'Butter', quantity: '2 kg', threshold: '5 kg', store: 'Store #5', percentage: 40 },
  { id: 'yeast', name: 'Yeast', quantity: '0.5 kg', threshold: '2 kg', store: 'Central Kitchen', percentage: 25 },
];

const recentOrders = [
  { id: 'ORD-001', from: 'HQ', to: 'Store #3', status: 'Delivered', date: '2023-05-01', items: 12 },
  { id: 'ORD-002', from: 'HQ', to: 'Central Kitchen', status: 'In Transit', date: '2023-05-02', items: 8 },
  { id: 'ORD-003', from: 'Central Kitchen', to: 'Store #1', status: 'Delivered', date: '2023-05-03', items: 15 },
  { id: 'ORD-004', from: 'HQ', to: 'Store #5', status: 'Pending', date: '2023-05-04', items: 10 },
];

const quickActions = [
  { id: 'send-ingredients', title: 'Send Ingredients', path: '/hq/send-ingredient', icon: <AddCircleOutline /> },
  { id: 'update-inventory', title: 'Update Inventory', path: '/hq/ingredient-list', icon: <Sync /> },
  { id: 'view-production', title: 'View Production', path: '/hq/production-list', icon: <Visibility /> },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to BreadTalk Stock & Delivery Management System
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryData.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card
              sx={{
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 3, flex: 1 }}>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(item.color, 0.16),
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        color: item.change.startsWith('+') ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {item.change.startsWith('+') ? (
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                      ) : (
                        <ArrowDownward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                      )}
                      {item.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      from last month
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ mt: 2, mb: 0.5, fontWeight: 700 }}>
                  {item.value}
                </Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Low Stock Alert */}
        <Grid item xs={12} md={6} lg={7}>
          <Card 
            sx={{ 
              height: '100%', 
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ p: 3, pb: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha('#ff9800', 0.16),
                      color: '#ff9800',
                      mr: 2,
                    }}
                  >
                    <Warning />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Low Stock Alert
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ flex: 1 }}>
                <List disablePadding>
                  {lowStockItems.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Inventory2 sx={{ color: 'text.secondary', mr: 1, fontSize: '1.25rem' }} />
                          <Typography variant="subtitle2" fontWeight={600}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ px: 1, py: 0.25, bgcolor: 'warning.lighter', color: 'warning.darker', borderRadius: 1 }}>
                          {item.store}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Current: {item.quantity} / Threshold: {item.threshold}
                        </Typography>
                        <Typography variant="caption" color="warning.main" fontWeight={600}>
                          {item.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: alpha('#ff9800', 0.16),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#ff9800',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </List>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/hq/send-ingredient')}
                  startIcon={<AddCircleOutline />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Place Order
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6} lg={5}>
          <Card 
            sx={{ 
              height: '100%', 
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ p: 3, pb: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha('#5e35b1', 0.16),
                      color: '#5e35b1',
                      mr: 2,
                    }}
                  >
                    <LocalShipping />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Recent Orders
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ flex: 1 }}>
                <List disablePadding>
                  {recentOrders.map((order) => (
                    <Box
                      key={order.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: alpha('#f5f5f5', 0.5),
                        '&:last-child': { mb: 0 }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {order.id}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontWeight: 600,
                            bgcolor: order.status === 'Delivered'
                              ? 'success.lighter'
                              : order.status === 'In Transit'
                                ? 'info.lighter'
                                : 'warning.lighter',
                            color: order.status === 'Delivered'
                              ? 'success.darker'
                              : order.status === 'In Transit'
                                ? 'info.darker'
                                : 'warning.darker',
                          }}
                        >
                          {order.status}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            From: {order.from} → To: {order.to}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {order.items} items • {order.date}
                          </Typography>
                        </Box>
                        {order.status === 'Delivered' ? (
                          <CheckCircleOutline color="success" fontSize="small" />
                        ) : order.status === 'In Transit' ? (
                          <LocalShipping color="info" fontSize="small" />
                        ) : (
                          <AccessTime color="warning" fontSize="small" />
                        )}
                      </Box>
                    </Box>
                  ))}
                </List>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/hq/order-history')}
                  startIcon={<Visibility />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  View All Orders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Quick Actions
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={12} sm={4} key={action.id}>
                    <Paper
                      onClick={() => navigate(action.path)}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.16),
                          color: 'primary.main',
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {action.title}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
