import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Search, Eye, X, RotateCcw, Truck, Calendar, MapPin, CreditCard, Building2, Banknote } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  shippingAddress: any;
  paymentMethod: string;
  status: string;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
  paymentStatus: string;
  deliveryStatus?: string;
  deliveredDate?: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [refundMethod, setRefundMethod] = useState('');
  const [refundDetails, setRefundDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Please Log In</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  useEffect(() => {

    // Load orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = allOrders.filter((order: Order) => order.userId === user?.id);
    
    // Add mock delivery statuses for demo, but preserve cancelled status
    const ordersWithStatus = userOrders.map((order: Order) => {
      // If order is already cancelled, keep it cancelled
      if (order.deliveryStatus === 'cancelled') {
        return order;
      }

      const daysSinceOrder = Math.floor((Date.now() - new Date(order.orderDate).getTime()) / (1000 * 60 * 60 * 24));
      
      let deliveryStatus = 'processing';
      if (daysSinceOrder >= 7) {
        deliveryStatus = 'delivered';
      } else if (daysSinceOrder >= 3) {
        deliveryStatus = 'shipped';
      } else if (daysSinceOrder >= 1) {
        deliveryStatus = 'confirmed';
      }

      return {
        ...order,
        deliveryStatus,
        deliveredDate: deliveryStatus === 'delivered' ? new Date(Date.now() - (daysSinceOrder - 7) * 24 * 60 * 60 * 1000).toISOString() : undefined
      };
    });

    // Filter out cancelled orders and show only active orders
    const activeOrders = ordersWithStatus.filter(order => order.deliveryStatus !== 'cancelled');
    setOrders(activeOrders);
    setFilteredOrders(activeOrders);
  }, [user]);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.trackingNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.deliveryStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.deliveryStatus === 'processing' || order.deliveryStatus === 'confirmed';
  };

  const canReturnOrder = (order: Order) => {
    return order.deliveryStatus === 'delivered' && order.deliveredDate &&
           (Date.now() - new Date(order.deliveredDate).getTime()) <= (48 * 60 * 60 * 1000); // 48 hours
  };

  const handleRefundDetailsChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    if (field === 'accountNumber') {
      value = value.replace(/\D/g, '');
    }
    if (field === 'ifscCode') {
      value = value.toUpperCase();
    }
    setRefundDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateRefundDetails = () => {
    if (refundMethod === 'card') {
      const { cardNumber, expiryDate, cardholderName } = refundDetails;
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive"
        });
        return false;
      }
      if (!expiryDate || expiryDate.length < 5) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date.",
          variant: "destructive"
        });
        return false;
      }
      if (!cardholderName.trim()) {
        toast({
          title: "Cardholder Name Required",
          description: "Please enter the cardholder name.",
          variant: "destructive"
        });
        return false;
      }
    } else if (refundMethod === 'bank') {
      const { accountNumber, ifscCode, accountHolderName, bankName } = refundDetails;
      if (!accountNumber || accountNumber.length < 9) {
        toast({
          title: "Invalid Account Number",
          description: "Please enter a valid account number.",
          variant: "destructive"
        });
        return false;
      }
      if (!ifscCode || ifscCode.length !== 11) {
        toast({
          title: "Invalid IFSC Code",
          description: "Please enter a valid 11-character IFSC code.",
          variant: "destructive"
        });
        return false;
      }
      if (!accountHolderName.trim()) {
        toast({
          title: "Account Holder Name Required",
          description: "Please enter the account holder name.",
          variant: "destructive"
        });
        return false;
      }
      if (!bankName.trim()) {
        toast({
          title: "Bank Name Required",
          description: "Please enter your bank name.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const processCancellation = () => {
    if (!refundMethod) {
      toast({
        title: "Refund Method Required",
        description: "Please select a refund method.",
        variant: "destructive"
      });
      return;
    }

    if (!validateRefundDetails()) {
      return;
    }

    if (!cancelOrderId) return;

    // Find the order to get amount
    const orderToCancel = orders.find(order => order.id === cancelOrderId);
    const refundAmount = orderToCancel ? orderToCancel.total * 1.03 : 0;

    // Remove cancelled order from the list
    const updatedOrders = orders.filter(order => order.id !== cancelOrderId);
    
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    
    // Update localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedAllOrders = allOrders.map((order: Order) => 
      order.id === cancelOrderId ? { ...order, deliveryStatus: 'cancelled' } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedAllOrders));

    // Reset form
    setCancelOrderId(null);
    setRefundMethod('');
    setRefundDetails({
      cardNumber: '',
      expiryDate: '',
      cardholderName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: ''
    });

    toast({
      title: "Order Cancelled & Refund Initiated",
      description: `Your order has been cancelled and refund of ${formatPrice(refundAmount)} will be processed within 3-5 business days to your selected ${refundMethod === 'card' ? 'card' : 'bank account'}.`,
    });
  };

  const handleCancelOrder = (orderId: string) => {
    setCancelOrderId(orderId);
  };

  const handleReturnOrder = (orderId: string) => {
    toast({
      title: "Return Request Initiated",
      description: "Your return request has been submitted. We'll contact you within 24 hours.",
    });
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-display font-playfair text-foreground mb-4">
            My Orders
          </h1>
          <p className="text-lg text-muted-foreground">
            Track and manage your jewelry orders
          </p>
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by order ID, tracking number, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Debug: Total orders: {orders.length}, Filtered: {filteredOrders.length}, User ID: {user?.id}
          </p>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="card-luxury">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {orders.length === 0 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : "No orders match your search criteria. Try adjusting your filters."
                }
              </p>
              <Button onClick={() => navigate('/shop')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="card-luxury">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.deliveryStatus || 'processing')}>
                        {getStatusText(order.deliveryStatus || 'processing')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-gold">{formatPrice(order.total * 1.03)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tracking Number</p>
                      <p className="font-semibold">{order.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Estimated Delivery</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Delivery Address</p>
                    <p className="flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                      <span>
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/track/${order.trackingNumber}`)}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Track Order
                    </Button>

                    {canCancelOrder(order) && (
                      <Dialog open={cancelOrderId === order.id} onOpenChange={(open) => !open && setCancelOrderId(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel Order
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Cancel Order & Process Refund</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium mb-2">Order Details:</p>
                              <p className="text-sm text-muted-foreground">Order ID: #{order.id}</p>
                              <p className="text-sm text-muted-foreground">Refund Amount: {formatPrice(order.total * 1.03)}</p>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">Select Refund Method:</Label>
                              <RadioGroup value={refundMethod} onValueChange={setRefundMethod} className="mt-2">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="card" id="refund-card" />
                                  <Label htmlFor="refund-card" className="flex items-center gap-2 cursor-pointer">
                                    <CreditCard className="h-4 w-4" />
                                    Refund to Card
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="bank" id="refund-bank" />
                                  <Label htmlFor="refund-bank" className="flex items-center gap-2 cursor-pointer">
                                    <Building2 className="h-4 w-4" />
                                    Refund to Bank Account
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {refundMethod === 'card' && (
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="refund-card-number">Card Number</Label>
                                  <Input
                                    id="refund-card-number"
                                    value={refundDetails.cardNumber}
                                    onChange={(e) => handleRefundDetailsChange('cardNumber', e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor="refund-expiry">Expiry Date</Label>
                                    <Input
                                      id="refund-expiry"
                                      value={refundDetails.expiryDate}
                                      onChange={(e) => handleRefundDetailsChange('expiryDate', e.target.value)}
                                      placeholder="MM/YY"
                                      maxLength={5}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="refund-cardholder">Cardholder Name</Label>
                                    <Input
                                      id="refund-cardholder"
                                      value={refundDetails.cardholderName}
                                      onChange={(e) => handleRefundDetailsChange('cardholderName', e.target.value)}
                                      placeholder="Name on card"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {refundMethod === 'bank' && (
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="refund-bank-name">Bank Name</Label>
                                  <Input
                                    id="refund-bank-name"
                                    value={refundDetails.bankName}
                                    onChange={(e) => handleRefundDetailsChange('bankName', e.target.value)}
                                    placeholder="e.g., State Bank of India"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="refund-account-number">Account Number</Label>
                                  <Input
                                    id="refund-account-number"
                                    value={refundDetails.accountNumber}
                                    onChange={(e) => handleRefundDetailsChange('accountNumber', e.target.value)}
                                    placeholder="Enter account number"
                                    maxLength={20}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor="refund-ifsc">IFSC Code</Label>
                                    <Input
                                      id="refund-ifsc"
                                      value={refundDetails.ifscCode}
                                      onChange={(e) => handleRefundDetailsChange('ifscCode', e.target.value)}
                                      placeholder="e.g., SBIN0001234"
                                      maxLength={11}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="refund-account-holder">Account Holder</Label>
                                    <Input
                                      id="refund-account-holder"
                                      value={refundDetails.accountHolderName}
                                      onChange={(e) => handleRefundDetailsChange('accountHolderName', e.target.value)}
                                      placeholder="As per bank"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => setCancelOrderId(null)}
                                className="flex-1"
                              >
                                Keep Order
                              </Button>
                              <Button 
                                onClick={processCancellation}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                disabled={!refundMethod}
                              >
                                <Banknote className="h-4 w-4 mr-1" />
                                Cancel & Refund
                              </Button>
                            </div>

                            <div className="text-xs text-muted-foreground text-center">
                              Refund will be processed within 3-5 business days
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {canReturnOrder(order) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReturnOrder(order.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Return/Refund
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cancellation & Refund Policy */}
        <Card className="card-luxury mt-8">
          <CardHeader>
            <CardTitle>Cancellation & Refund Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Fair, Transparent, and Customer-Centric</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3 text-gold">Order Cancellations</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium mb-1">Retail Orders:</h5>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Cancellations must be requested within 2 hours of order placement</li>
                    <li>Once processed, packed, or dispatched, cancellations are not possible</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Custom/Personalized Jewelry:</h5>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Orders for engraved, made-to-order, or specially customized items cannot be cancelled once production begins</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3 text-gold">Returns & Exchanges</h4>
              <p className="text-muted-foreground mb-2">We maintain strict quality checks before dispatch. However, if you receive:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2 mb-3">
                <li>A damaged product</li>
                <li>A wrong item or incorrect order fulfillment</li>
                <li>A manufacturing defect</li>
              </ul>
              <p className="text-muted-foreground mb-2"><strong>You must report the issue within 48 hours of delivery.</strong></p>
              <p className="text-muted-foreground mb-2">On verification, we will provide:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Replacement of the same product</li>
                <li>Exchange with another item of equal value</li>
                <li>Refund (where replacement is not possible)</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3 text-gold">Non-Returnable Items</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Custom-made, engraved, or personalized jewelry</li>
                <li>Items damaged due to improper handling after delivery</li>
                <li>Products returned without prior authorization</li>
                <li>Orders where tamper-proof packaging is broken or missing</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3 text-gold">Refund Process</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Once a refund is approved, it will be initiated within 3–5 business days</li>
                <li>Refunds are processed via the original payment method (card, UPI, bank transfer)</li>
                <li>Refund timelines depend on your bank/payment provider (usually 5–10 business days)</li>
                <li>For wholesale/export clients, refunds may be adjusted as credit notes for future orders</li>
              </ul>
            </div>

            <Separator />

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-600">Exceptions</h4>
              <p className="text-muted-foreground mb-2">Refunds or cancellations will not apply in the following cases:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Delays caused by courier/logistics partners beyond our control</li>
                <li>Daily fluctuations in gold/silver market rates affecting price differences</li>
                <li>Change of mind after dispatch or acceptance of delivery</li>
              </ul>
            </div>

            <Separator />

            <div className="bg-gold/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Need Assistance?</h4>
              <p className="text-muted-foreground mb-3">For support with cancellations, refunds, or return claims, please contact:</p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>JRB Gold</strong></p>
                <p>Address: No: 1539, 1st Floor, Soundar Complex, Vellore Road<br/>Near Anna Arch, Thiruvannamalai, Tamil Nadu - 606604</p>
                <p><strong>Mobile:</strong> 82204 21317</p>
                <p><strong>Email:</strong> contact@jrbgold.co.in</p>
                <p><strong>Website:</strong> https://www.jrbgold.co.in</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
