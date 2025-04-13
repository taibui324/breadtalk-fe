import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Done as FinishIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Sample data for the store's products
interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
}

const productsList: Product[] = [
  { id: 'prod-001', name: 'Basic White Bread', category: 'Breads', unit: 'loaf' },
  { id: 'prod-002', name: 'Multigrain Bread', category: 'Breads', unit: 'loaf' },
  { id: 'prod-003', name: 'Sourdough Bread', category: 'Breads', unit: 'loaf' },
  { id: 'prod-004', name: 'Baguette', category: 'Breads', unit: 'piece' },
  { id: 'prod-005', name: 'Chocolate Croissant', category: 'Pastries', unit: 'piece' },
  { id: 'prod-006', name: 'Butter Croissant', category: 'Pastries', unit: 'piece' },
  { id: 'prod-007', name: 'Cinnamon Roll', category: 'Pastries', unit: 'piece' },
  { id: 'prod-008', name: 'Cheese Danish', category: 'Pastries', unit: 'piece' },
  { id: 'prod-009', name: 'Blueberry Muffin', category: 'Muffins', unit: 'piece' },
  { id: 'prod-010', name: 'Chocolate Chip Cookie', category: 'Cookies', unit: 'piece' },
];

// Sample inventory data
const storeInventory = {
  ingredients: [
    { id: 'ing-001', name: 'Flour', quantity: 45, unit: 'kg' },
    { id: 'ing-002', name: 'Sugar', quantity: 28, unit: 'kg' },
    { id: 'ing-003', name: 'Salt', quantity: 8, unit: 'kg' },
    { id: 'ing-004', name: 'Butter', quantity: 12, unit: 'kg' },
    { id: 'ing-005', name: 'Milk', quantity: 15, unit: 'liters' },
    { id: 'ing-006', name: 'Eggs', quantity: 9, unit: 'dozen' },
    { id: 'ing-007', name: 'Yeast', quantity: 2, unit: 'kg' },
  ],
  products: [
    { id: 'prod-001', name: 'Basic White Bread', quantity: 10, unit: 'loaf' },
    { id: 'prod-002', name: 'Multigrain Bread', quantity: 8, unit: 'loaf' },
    { id: 'prod-005', name: 'Chocolate Croissant', quantity: 15, unit: 'piece' },
    { id: 'prod-006', name: 'Butter Croissant', quantity: 12, unit: 'piece' },
  ],
};

// Simple recipe database
const productRecipes = {
  'prod-001': [
    { ingredientId: 'ing-001', quantity: 0.5 }, // Flour
    { ingredientId: 'ing-003', quantity: 0.01 }, // Salt
    { ingredientId: 'ing-007', quantity: 0.01 }, // Yeast
    { ingredientId: 'ing-004', quantity: 0.05 }, // Butter
  ],
  'prod-002': [
    { ingredientId: 'ing-001', quantity: 0.4 }, // Flour
    { ingredientId: 'ing-003', quantity: 0.01 }, // Salt
    { ingredientId: 'ing-007', quantity: 0.01 }, // Yeast
    { ingredientId: 'ing-004', quantity: 0.04 }, // Butter
  ],
  'prod-005': [
    { ingredientId: 'ing-001', quantity: 0.1 }, // Flour
    { ingredientId: 'ing-002', quantity: 0.03 }, // Sugar
    { ingredientId: 'ing-004', quantity: 0.05 }, // Butter
    { ingredientId: 'ing-006', quantity: 0.1 }, // Eggs (in dozens)
  ],
  'prod-006': [
    { ingredientId: 'ing-001', quantity: 0.1 }, // Flour
    { ingredientId: 'ing-003', quantity: 0.005 }, // Salt
    { ingredientId: 'ing-004', quantity: 0.07 }, // Butter
  ],
};

interface ProductionItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  category: string;
}

interface ProductionDay {
  date: string;
  status: 'draft' | 'in-progress' | 'completed';
  items: ProductionItem[];
  remainingItems?: ProductionItem[];
}

export default function StoreDailyProduction() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number | string>('');
  const [productionDay, setProductionDay] = useState<ProductionDay>({
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    items: [],
  });
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [remainingItems, setRemainingItems] = useState<ProductionItem[]>([]);

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Check if we have enough ingredients
    const canProduce = checkIngredientAvailability(selectedProduct.id, Number(quantity));

    if (!canProduce.success) {
      toast.error(`Not enough ingredients: ${canProduce.message}`);
      return;
    }

    // Check if product already exists in the list
    const existingItem = productionDay.items.find(item => item.productId === selectedProduct.id);

    if (existingItem) {
      // Update existing item
      setProductionDay({
        ...productionDay,
        items: productionDay.items.map(item =>
          item.productId === selectedProduct.id
            ? { ...item, quantity: Number(item.quantity) + Number(quantity) }
            : item
        )
      });
    } else {
      // Add new item
      setProductionDay({
        ...productionDay,
        items: [
          ...productionDay.items,
          {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            quantity: Number(quantity),
            unit: selectedProduct.unit,
            category: selectedProduct.category,
          },
        ],
      });
    }

    // Reset selection
    setSelectedProduct(null);
    setQuantity('');
  };

  const handleRemoveProduct = (productId: string) => {
    setProductionDay({
      ...productionDay,
      items: productionDay.items.filter(item => item.productId !== productId)
    });
  };

  const checkIngredientAvailability = (productId: string, quantity: number) => {
    const recipe = productRecipes[productId as keyof typeof productRecipes];

    if (!recipe) {
      return { success: true, message: "" }; // Assume we can make it if no recipe exists
    }

    for (const ingredient of recipe) {
      const storeIngredient = storeInventory.ingredients.find(
        ing => ing.id === ingredient.ingredientId
      );

      if (!storeIngredient) {
        return {
          success: false,
          message: "Missing ingredient in inventory"
        };
      }

      const requiredAmount = ingredient.quantity * quantity;

      if (storeIngredient.quantity < requiredAmount) {
        return {
          success: false,
          message: `Need ${requiredAmount} ${storeIngredient.unit} of ${storeIngredient.name}, but only have ${storeIngredient.quantity}`
        };
      }
    }

    return { success: true, message: "" };
  };

  const handleStartProduction = () => {
    if (productionDay.items.length === 0) {
      toast.error('Add at least one product to start production');
      return;
    }

    // In a real app, this would update the database and subtract ingredients
    setProductionDay({
      ...productionDay,
      status: 'in-progress',
    });

    toast.success('Production started!');
  };

  const openFinishDialog = () => {
    // Pre-populate remaining items with the full production as a starting point
    setRemainingItems(productionDay.items.map(item => ({ ...item, quantity: 0 })));
    setIsFinishDialogOpen(true);
  };

  const handleRemainingChange = (productId: string, value: number) => {
    setRemainingItems(
      remainingItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: value }
          : item
      )
    );
  };

  const handleFinishProduction = () => {
    // In a real app, this would update the database and add products
    setProductionDay({
      ...productionDay,
      status: 'completed',
      remainingItems,
    });

    setIsFinishDialogOpen(false);
    toast.success('Production completed!');
  };

  const getProductsByCategoryForDisplay = () => {
    const categories: Record<string, ProductionItem[]> = {};

    for (const item of productionDay.items) {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    }

    return Object.entries(categories).map(([category, items]) => ({
      category,
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    }));
  };

  const getTotalProductsCount = () => {
    return productionDay.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Daily Production
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Plan and track today's bakery production
      </Typography>

      {/* Status Card */}
      <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 8,
            bgcolor:
              productionDay.status === 'completed'
                ? 'success.main'
                : productionDay.status === 'in-progress'
                  ? 'warning.main'
                  : 'info.main'
          }}
        />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Typography variant="h6">
                Production for {new Date(productionDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {' '}
                <Chip
                  size="small"
                  label={
                    productionDay.status === 'completed'
                      ? 'Completed'
                      : productionDay.status === 'in-progress'
                        ? 'In Progress'
                        : 'Draft'
                  }
                  color={
                    productionDay.status === 'completed'
                      ? 'success'
                      : productionDay.status === 'in-progress'
                        ? 'warning'
                        : 'info'
                  }
                />
              </Typography>
            </Grid>
            <Grid item>
              {productionDay.status === 'draft' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<StartIcon />}
                  onClick={handleStartProduction}
                  disabled={productionDay.items.length === 0}
                >
                  Start Production
                </Button>
              )}
              {productionDay.status === 'in-progress' && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FinishIcon />}
                  onClick={openFinishDialog}
                >
                  Finish Production
                </Button>
              )}
              {productionDay.status === 'completed' && (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/store/production-list')}
                >
                  View All Productions
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Production Form */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Production Items
            </Typography>

            {(productionDay.status === 'draft') && (
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={productsList}
                      getOptionLabel={(option) => option.name}
                      value={selectedProduct}
                      onChange={(_, newValue) => setSelectedProduct(newValue)}
                      disabled={productionDay.status !== 'draft'}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Product" fullWidth />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            {option.name}
                            <Typography variant="caption" color="text.secondary" display="block">
                              Category: {option.category}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      disabled={productionDay.status !== 'draft'}
                      InputProps={{
                        endAdornment: selectedProduct ? (
                          <InputAdornment position="end">
                            {selectedProduct.unit}s
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddProduct}
                      disabled={productionDay.status !== 'draft'}
                    >
                      Add Item
                    </Button>
                  </Grid>
                </Grid>
                <Alert severity="info" sx={{ mt: 3 }}>
                  Adding products to the production plan will automatically check and deduct required ingredients from your inventory.
                </Alert>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {productionDay.items.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      {productionDay.status === 'draft' && (
                        <TableCell align="right">Action</TableCell>
                      )}
                      {productionDay.status === 'completed' && (
                        <TableCell align="right">Remaining</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productionDay.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.unit}s</TableCell>
                        {productionDay.status === 'draft' && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveProduct(item.productId)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                        {productionDay.status === 'completed' && (
                          <TableCell align="right">
                            {productionDay.remainingItems?.find(ri => ri.productId === item.productId)?.quantity || 0}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No products added to today's production yet.
                </Typography>
                {productionDay.status === 'draft' && (
                  <Typography variant="body2" color="text.secondary">
                    Use the form above to add products.
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 2, position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Production Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {new Date(productionDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Products
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {productionDay.items.length} different products
                  </Typography>
                  <Chip
                    label={`${getTotalProductsCount()} units total`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Products by Category
              </Typography>

              {getProductsByCategoryForDisplay().map((category) => (
                <Box key={category.category} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {category.category}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ml: 2,
                      mt: 0.5
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {category.items.length} products
                    </Typography>
                    <Typography variant="body2">
                      {category.totalQuantity} units
                    </Typography>
                  </Box>
                </Box>
              ))}

              {productionDay.status === 'completed' && productionDay.remainingItems && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                      Remaining Products
                    </Typography>
                    <Tooltip title="Products remaining at the end of the day">
                      <IconButton size="small" sx={{ ml: 0.5 }}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {productionDay.remainingItems.filter(item => item.quantity > 0).length > 0 ? (
                    productionDay.remainingItems.filter(item => item.quantity > 0).map((item) => (
                      <Box
                        key={item.productId}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          bgcolor: 'background.default',
                          p: 1,
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <Typography variant="body2">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {item.quantity} {item.unit}s
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
                      No products remaining
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Finish Production Dialog */}
      <Dialog open={isFinishDialogOpen} onClose={() => setIsFinishDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Finish Production</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Enter the quantity of each product remaining at the end of the day.
            This will update your inventory.
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Produced</TableCell>
                  <TableCell align="right">Remaining</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productionDay.items.map((item) => {
                  const remainingItem = remainingItems.find(ri => ri.productId === item.productId);
                  return (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          InputProps={{ inputProps: { min: 0, max: item.quantity } }}
                          value={remainingItem ? remainingItem.quantity : 0}
                          onChange={(e) => {
                            const value = Math.min(item.quantity, Math.max(0, Number(e.target.value)));
                            handleRemainingChange(item.productId, value);
                          }}
                          size="small"
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFinishDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFinishProduction}>
            Finish Production
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
