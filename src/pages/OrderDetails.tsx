import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, MapPin, Calendar, CreditCard, Phone, Mail, CheckCircle, Clock, X, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  tax?: number;
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

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Get order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId && o.userId === user?.id);
    
    if (!foundOrder) {
      navigate('/orders');
      return;
    }

    // Add mock delivery status
    const daysSinceOrder = Math.floor((Date.now() - new Date(foundOrder.orderDate).getTime()) / (1000 * 60 * 60 * 24));
    
    let deliveryStatus = 'processing';
    if (daysSinceOrder >= 7) {
      deliveryStatus = 'delivered';
    } else if (daysSinceOrder >= 3) {
      deliveryStatus = 'shipped';
    } else if (daysSinceOrder >= 1) {
      deliveryStatus = 'confirmed';
    }

    setOrder({
      ...foundOrder,
      deliveryStatus,
      deliveredDate: deliveryStatus === 'delivered' ? new Date(Date.now() - (daysSinceOrder - 7) * 24 * 60 * 60 * 1000).toISOString() : undefined
    });
  }, [orderId, user, isAuthenticated, navigate]);

  if (!order) {
    return <div>Loading...</div>;
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'credit-card':
        return 'Credit Card';
      case 'debit-card':
        return 'Debit Card';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  const getTrackingSteps = () => {
    const steps = [
      { id: 'processing', label: 'Order Processing', icon: Clock },
      { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
      { id: 'shipped', label: 'Shipped', icon: Truck },
      { id: 'delivered', label: 'Delivered', icon: Package }
    ];

    const statusOrder = ['processing', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.deliveryStatus || 'processing');

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const getProgressPercentage = () => {
    const statusOrder = ['processing', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.deliveryStatus || 'processing');
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const canCancelOrder = () => {
    return order.deliveryStatus === 'processing' || order.deliveryStatus === 'confirmed';
  };

  const canReturnOrder = () => {
    return order.deliveryStatus === 'delivered' && order.deliveredDate &&
           (Date.now() - new Date(order.deliveredDate).getTime()) <= (48 * 60 * 60 * 1000);
  };

  const handleCancelOrder = () => {
    // Update order status
    const updatedOrder = { ...order, deliveryStatus: 'cancelled' };
    setOrder(updatedOrder);
    
    // Update localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedAllOrders = allOrders.map((o: Order) => 
      o.id === orderId ? { ...o, deliveryStatus: 'cancelled' } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedAllOrders));

    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully. Refund will be processed within 3-5 business days.",
    });
  };

  const handleReturnOrder = () => {
    toast({
      title: "Return Request Initiated",
      description: "Your return request has been submitted. Our team will contact you within 24 hours to arrange pickup.",
    });
  };

  const trackingSteps = getTrackingSteps();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/orders')}
            className="mb-4"
          >
            ← Back to Orders
          </Button>
          <h1 className="text-display font-playfair text-foreground mb-2">
            Order Details
          </h1>
          <p className="text-lg text-muted-foreground">
            Order #{order.id}
          </p>
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(getProgressPercentage())}% Complete
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="space-y-4">
                  {trackingSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : step.current 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </p>
                          {step.current && (
                            <p className="text-sm text-muted-foreground">
                              Currently in progress
                            </p>
                          )}
                          {step.completed && step.id === 'delivered' && order.deliveredDate && (
                            <p className="text-sm text-muted-foreground">
                              Delivered on {formatDate(order.deliveredDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">Tracking Number</span>
                  </div>
                  <p className="font-mono text-sm">{order.trackingNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Quantity: {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {canCancelOrder() && (
                <Button 
                  variant="outline"
                  onClick={handleCancelOrder}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}

              {canReturnOrder() && (
                <Button 
                  variant="outline"
                  onClick={handleReturnOrder}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Return/Refund
                </Button>
              )}

              <Button 
                variant="outline"
                onClick={() => window.print()}
              >
                Print Order
              </Button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-semibold">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={
                      order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.deliveryStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {order.deliveryStatus || 'Processing'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Status</p>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span>{formatPrice(order.tax || order.total * 0.03)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(order.total + (order.tax || order.total * 0.03))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {order.shippingAddress.phone}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {order.shippingAddress.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{getPaymentMethodDisplay(order.paymentMethod)}</p>
                {order.paymentMethod === 'cod' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay {formatPrice(order.total * 1.03)} when delivered
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <Card className="card-luxury mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help with Your Order?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our customer support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>82204 21317</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@jrbgold.co.in</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;
