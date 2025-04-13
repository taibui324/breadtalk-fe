import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  FormHelperText,
  Autocomplete,
  Chip,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Sample data
const locationOptions = [
  { id: 'ck-001', name: 'Central Kitchen - Main', type: 'central-kitchen' },
  { id: 'st-001', name: 'Store #1 - Downtown', type: 'store' },
  { id: 'st-002', name: 'Store #2 - Westside', type: 'store' },
  { id: 'st-003', name: 'Store #3 - Northgate', type: 'store' },
  { id: 'st-004', name: 'Store #4 - Eastside', type: 'store' },
  { id: 'st-005', name: 'Store #5 - Southcenter', type: 'store' },
];

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
}

const ingredientsList: Ingredient[] = [
  { id: 'ing-001', name: 'Flour', unit: 'kg', stock: 500 },
  { id: 'ing-002', name: 'Sugar', unit: 'kg', stock: 300 },
  { id: 'ing-003', name: 'Salt', unit: 'kg', stock: 100 },
  { id: 'ing-004', name: 'Butter', unit: 'kg', stock: 150 },
  { id: 'ing-005', name: 'Milk', unit: 'liters', stock: 200 },
  { id: 'ing-006', name: 'Eggs', unit: 'dozen', stock: 50 },
  { id: 'ing-007', name: 'Yeast', unit: 'kg', stock: 30 },
  { id: 'ing-008', name: 'Baking Powder', unit: 'kg', stock: 25 },
  { id: 'ing-009', name: 'Vanilla Extract', unit: 'liters', stock: 10 },
  { id: 'ing-010', name: 'Chocolate Chips', unit: 'kg', stock: 75 },
];

interface OrderItem {
  ingredientId: string;
  quantity: number;
  ingredientName: string;
  unit: string;
}

export default function HQSendIngredientPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState<number | string>('');
  const [notes, setNotes] = useState('');

  // Form validation
  const [errors, setErrors] = useState({
    location: '',
    items: '',
  });

  const handleAddItem = () => {
    if (!selectedIngredient) {
      toast.error('Please select an ingredient');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Check if ingredient already exists in the order
    const existingItem = orderItems.find(item => item.ingredientId === selectedIngredient.id);

    if (existingItem) {
      // Update existing item
      setOrderItems(
        orderItems.map(item =>
          item.ingredientId === selectedIngredient.id
            ? { ...item, quantity: Number(item.quantity) + Number(quantity) }
            : item
        )
      );
    } else {
      // Add new item
      setOrderItems([
        ...orderItems,
        {
          ingredientId: selectedIngredient.id,
          ingredientName: selectedIngredient.name,
          quantity: Number(quantity),
          unit: selectedIngredient.unit,
        },
      ]);
    }

    // Reset selection
    setSelectedIngredient(null);
    setQuantity('');
  };

  const handleRemoveItem = (ingredientId: string) => {
    setOrderItems(orderItems.filter(item => item.ingredientId !== ingredientId));
  };

  const validateForm = () => {
    const newErrors = {
      location: '',
      items: '',
    };

    let isValid = true;

    if (!location) {
      newErrors.location = 'Please select a destination';
      isValid = false;
    }

    if (orderItems.length === 0) {
      newErrors.items = 'Please add at least one ingredient';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real application, you would send this data to your API
    const orderData = {
      destinationId: location,
      destinationName: locationOptions.find(l => l.id === location)?.name,
      items: orderItems,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('Sending order:', orderData);

    // Success notification
    toast.success('Ingredient order successfully sent!');

    // Reset form or navigate
    setLocation('');
    setOrderItems([]);
    setNotes('');

    // Optionally navigate to order history
    // navigate('/hq/order-history');
  };

  const getLocationName = (locationId: string) => {
    const loc = locationOptions.find(l => l.id === locationId);
    return loc ? loc.name : 'Unknown Location';
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Send Ingredients
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create a new ingredient order to send from Headquarters to a Store or Central Kitchen
      </Typography>

      <Grid container spacing={3}>
        {/* Order Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Order Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Destination"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  error={!!errors.location}
                  helperText={errors.location}
                >
                  {locationOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name} ({option.type === 'central-kitchen' ? 'Central Kitchen' : 'Store'})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Add Ingredients
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select ingredients and quantities to include in this order
              </Typography>

              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={ingredientsList}
                    getOptionLabel={(option) => option.name}
                    value={selectedIngredient}
                    onChange={(_, newValue) => setSelectedIngredient(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Ingredient" fullWidth />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          {option.name}
                          <Typography variant="caption" color="text.secondary" display="block">
                            Current Stock: {option.stock} {option.unit}
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
                    InputProps={{
                      endAdornment: selectedIngredient ? selectedIngredient.unit : '',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                  >
                    Add Item
                  </Button>
                </Grid>
              </Grid>

              {errors.items && (
                <FormHelperText error>{errors.items}</FormHelperText>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Order Items
            </Typography>

            {orderItems.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.ingredientId}>
                        <TableCell>{item.ingredientName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.unit}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.ingredientId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No items added to this order yet. Use the form above to add ingredients.
              </Typography>
            )}

            <Box sx={{ mt: 4 }}>
              <TextField
                fullWidth
                label="Order Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or notes for this order..."
              />
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/hq/order-history')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={orderItems.length === 0}
              >
                Send Order
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1">
                  {getFormattedDate()}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Sending From
                </Typography>
                <Typography variant="body1">
                  Headquarters
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Destination
                </Typography>
                <Typography variant="body1">
                  {location ? getLocationName(location) : 'Not selected'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {orderItems.length} different ingredients
                  </Typography>
                  <Chip
                    label={`${getTotalItems()} units total`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Stack spacing={1}>
                {orderItems.map((item) => (
                  <Box
                    key={item.ingredientId}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      bgcolor: 'background.default',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2">
                      {item.ingredientName}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.quantity} {item.unit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
