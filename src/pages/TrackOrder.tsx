import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Truck, Package, CheckCircle, Clock, MapPin, Phone, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
  completed: boolean;
}

const TrackOrder = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingNumber) {
      navigate('/orders');
      return;
    }

    // Load order from localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = allOrders.find((order: Order) => order.trackingNumber === trackingNumber);
    
    if (!foundOrder) {
      setLoading(false);
      return;
    }

    // Add mock delivery status based on order date
    const daysSinceOrder = Math.floor((Date.now() - new Date(foundOrder.orderDate).getTime()) / (1000 * 60 * 60 * 24));
    
    let deliveryStatus = 'processing';
    if (daysSinceOrder >= 7) {
      deliveryStatus = 'delivered';
    } else if (daysSinceOrder >= 3) {
      deliveryStatus = 'shipped';
    } else if (daysSinceOrder >= 1) {
      deliveryStatus = 'confirmed';
    }

    const orderWithStatus = {
      ...foundOrder,
      deliveryStatus,
      deliveredDate: deliveryStatus === 'delivered' ? new Date(Date.now() - (daysSinceOrder - 7) * 24 * 60 * 60 * 1000).toISOString() : undefined
    };

    setOrder(orderWithStatus);

    // Generate mock tracking events
    const events: TrackingEvent[] = [];
    const orderDate = new Date(foundOrder.orderDate);

    // Order placed
    events.push({
      date: orderDate.toLocaleDateString('en-IN'),
      time: orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Order Placed',
      location: 'JRB Gold Store',
      description: 'Your order has been received and is being processed',
      completed: true
    });

    // Order confirmed (1 day later)
    if (daysSinceOrder >= 1) {
      const confirmedDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
      events.push({
        date: confirmedDate.toLocaleDateString('en-IN'),
        time: confirmedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Order Confirmed',
        location: 'JRB Gold Store',
        description: 'Your order has been confirmed and is being prepared for shipment',
        completed: true
      });
    }

    // Shipped (3 days later)
    if (daysSinceOrder >= 3) {
      const shippedDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      events.push({
        date: shippedDate.toLocaleDateString('en-IN'),
        time: shippedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Shipped',
        location: 'Thiruvannamalai Distribution Center',
        description: 'Your order has been shipped and is on its way to you',
        completed: true
      });
    }

    // In transit (5 days later)
    if (daysSinceOrder >= 5) {
      const transitDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      events.push({
        date: transitDate.toLocaleDateString('en-IN'),
        time: transitDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'In Transit',
        location: 'Local Delivery Hub',
        description: 'Your package is at the local delivery hub and will be delivered soon',
        completed: true
      });
    }

    // Delivered (7 days later)
    if (daysSinceOrder >= 7) {
      const deliveredDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      events.push({
        date: deliveredDate.toLocaleDateString('en-IN'),
        time: deliveredDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        location: foundOrder.shippingAddress.city,
        description: 'Your order has been successfully delivered',
        completed: true
      });
    } else {
      // Expected delivery
      const expectedDate = new Date(foundOrder.estimatedDelivery);
      events.push({
        date: expectedDate.toLocaleDateString('en-IN'),
        time: 'Expected by 6:00 PM',
        status: 'Out for Delivery',
        location: foundOrder.shippingAddress.city,
        description: 'Your order is out for delivery and will arrive today',
        completed: false
      });
    }

    setTrackingEvents(events);
    setLoading(false);
  }, [trackingNumber, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed':
        return 'bg-blue-100 text-blue-800';
      case 'order confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'in transit':
        return 'bg-orange-100 text-orange-800';
      case 'out for delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    const completedEvents = trackingEvents.filter(event => event.completed).length;
    return (completedEvents / trackingEvents.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tracking information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Tracking Number Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find an order with tracking number: {trackingNumber}
            </p>
            <Button onClick={() => navigate('/orders')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/orders')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <h1 className="text-display font-playfair text-foreground mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Tracking Number: <span className="font-semibold text-foreground">{trackingNumber}</span>
          </p>
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        {/* Progress Bar */}
        <Card className="card-luxury mb-6">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Order Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Order Placed</span>
              <span>Confirmed</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingEvents.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        {index < trackingEvents.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            event.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.date} at {event.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {event.location}
                        </p>
                        <p className="text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-gold">{formatPrice(order.total * 1.03)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-semibold">{order.items.length} item(s)</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Delivery Address</p>
                  <div className="text-sm">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}</p>
                    <p className="mt-1">📱 {order.shippingAddress.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Contact our customer support for any queries about your order.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    82204 21317
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    contact@jrbgold.co.in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
