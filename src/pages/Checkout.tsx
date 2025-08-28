import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck, MapPin, Phone, Mail, User, Calendar, Lock, Building2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, taxBreakdown } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Get URL parameters to check if single item checkout
  const urlParams = new URLSearchParams(window.location.search);
  const singleItemId = urlParams.get('item');
  
  // Filter items based on checkout type
  const checkoutItems = singleItemId 
    ? cartItems.filter(item => item.id === singleItemId)
    : cartItems;
  
  // Calculate totals for checkout items
  const checkoutSubtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const checkoutTax = checkoutSubtotal * 0.18; // 18% GST
  const checkoutTotal = checkoutSubtotal + checkoutTax;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [netBankingDetails, setNetBankingDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });

  // Handle scrolling to payment method section
  useEffect(() => {
    // Scroll to payment method section if hash is present
    if (window.location.hash === '#payment-method') {
      setTimeout(() => {
        const element = document.getElementById('payment-method');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Show loading or redirect if needed
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to continue with checkout</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/cart')}>Go to Cart</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardDetailsChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      // Format card number with spaces
      value = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (field === 'expiryDate') {
      // Format expiry date as MM/YY
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNetBankingDetailsChange = (field: string, value: string) => {
    if (field === 'accountNumber') {
      // Only allow numbers
      value = value.replace(/\D/g, '');
    }
    if (field === 'ifscCode') {
      // Convert to uppercase
      value = value.toUpperCase();
    }
    setNetBankingDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return false;
    }

    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        toast({
          title: "Missing Information",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          variant: "destructive"
        });
        return false;
      }
    }

    if ((paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && 
        (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName)) {
      toast({
        title: "Card Details Required",
        description: "Please fill in all card details.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
    
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
        description: "Please enter a valid expiry date (MM/YY).",
        variant: "destructive"
      });
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!cardholderName.trim()) {
      toast({
        title: "Invalid Cardholder Name",
        description: "Please enter the cardholder name.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateNetBankingDetails = () => {
    const { bankName, accountNumber, ifscCode, accountHolderName } = netBankingDetails;
    
    if (!bankName.trim()) {
      toast({
        title: "Bank Name Required",
        description: "Please enter your bank name.",
        variant: "destructive"
      });
      return false;
    }
    
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
    
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    if ((paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && !validateCardDetails()) {
      return false;
    }

    if (paymentMethod === 'net-banking' && !validateNetBankingDetails()) {
      return false;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create order
      const orderId = `JRB${Date.now()}`;
      const order = {
        id: orderId,
        userId: user?.id,
        items: checkoutItems,
        total: checkoutTotal,
        shippingAddress,
        paymentMethod,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: `TRK${Date.now()}`,
        paymentStatus: 'paid'
      };

      // Save order to localStorage (in real app, this would be API call)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderId}`);

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-display font-playfair text-foreground mb-4">
            Checkout
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete your order securely
          </p>
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="card-luxury" id="payment-method">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* Credit Card */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                        <Badge variant="secondary">Secure</Badge>
                      </Label>
                    </div>

                    {/* Debit Card */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="debit-card" id="debit-card" />
                      <Label htmlFor="debit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-4 w-4" />
                        Debit Card
                        <Badge variant="secondary">Secure</Badge>
                      </Label>
                    </div>

                    {/* Net Banking */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="net-banking" id="net-banking" />
                      <Label htmlFor="net-banking" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Building2 className="h-4 w-4" />
                        Net Banking
                        <Badge variant="secondary">Secure</Badge>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Card Details Form */}
                {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Card Details
                    </h4>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleCardDetailsChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardDetailsChange('cardholderName', e.target.value)}
                        placeholder="Name as on card"
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking Details Form */}
                {paymentMethod === 'net-banking' && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Net Banking Details
                    </h4>
                    
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={netBankingDetails.bankName}
                        onChange={(e) => handleNetBankingDetailsChange('bankName', e.target.value)}
                        placeholder="e.g., State Bank of India"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={netBankingDetails.accountNumber}
                        onChange={(e) => handleNetBankingDetailsChange('accountNumber', e.target.value)}
                        placeholder="Enter your account number"
                        maxLength={20}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          value={netBankingDetails.ifscCode}
                          onChange={(e) => handleNetBankingDetailsChange('ifscCode', e.target.value)}
                          placeholder="e.g., SBIN0001234"
                          maxLength={11}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                        <Input
                          id="accountHolderName"
                          value={netBankingDetails.accountHolderName}
                          onChange={(e) => handleNetBankingDetailsChange('accountHolderName', e.target.value)}
                          placeholder="As per bank records"
                        />
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <Lock className="h-3 w-3 inline mr-1" />
                      Your banking details are encrypted and secure. We use bank-grade security.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-luxury sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-medium text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(checkoutSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span>{formatPrice(checkoutTax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(checkoutTotal)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={processPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Pay Now - {formatPrice(checkoutTotal)}
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-xs text-muted-foreground text-center">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Your payment information is secure and encrypted
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

export default Checkout;
