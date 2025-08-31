'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

const products: Product[] = [
  {
    id: 'pro_monthly',
    name: 'Pro Plan - Monthly',
    price: 199,
    description:
      'Full access for developers who ship. Less than one hour of debugging time.',
  },
  {
    id: 'pro_yearly',
    name: 'Pro Plan - Yearly',
    price: 1908,
    description: 'Save 20% with annual billing - $159/month',
  },
];

export function CheckoutForm() {
  const [selectedProduct, setSelectedProduct] = useState<string>('pro_monthly');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const totalPrice = selectedProductData
    ? selectedProductData.price * quantity
    : 0;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // This will call your Xano endpoint
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct,
          quantity,
          // Add any other necessary data
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Checkout error:', error);
      // Handle error - show toast or alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="pricing-card w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Select Your Plan</CardTitle>
        <CardDescription className="text-base">
          Join developers who are shipping production APIs in minutes, not
          months
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Selection */}
        <div className="space-y-3">
          <Label>Select Plan</Label>
          <RadioGroup
            value={selectedProduct}
            onValueChange={setSelectedProduct}
          >
            {products.map(product => (
              <div key={product.id} className="mb-3">
                <div
                  className={cn(
                    'flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all duration-200',
                    selectedProduct === product.id
                      ? 'border-primary from-primary/10 to-primary/5 bg-gradient-to-br shadow-md'
                      : 'border-muted hover:border-muted-foreground/20 hover:shadow-sm'
                  )}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <RadioGroupItem
                    value={product.id}
                    id={product.id}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={product.id} className="cursor-pointer">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {product.description}
                      </div>
                      <div className="mt-1 text-lg font-bold">
                        ${product.price}
                        {product.id.includes('yearly') ? '/year' : '/month'}
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Quantity Selection (for team licenses) */}
        <div className="space-y-3">
          <Label htmlFor="quantity">Number of Licenses</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
            className="w-32"
          />
          <p className="text-muted-foreground text-sm">
            Add team members to collaborate on Xano projects
          </p>
        </div>

        <Separator />

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
          {selectedProduct?.includes('yearly') && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              You're saving $480 per year with annual billing!
            </p>
          )}
        </div>

        {/* Checkout Button */}
        <Button
          size="lg"
          className="hero-cta-primary h-14 w-full text-lg font-semibold"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Secure Payment →'}
        </Button>

        {/* Trust Indicators */}
        <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span>🔒</span>
            Secure payment
          </span>
          <span className="flex items-center gap-1">
            <span>💳</span>
            Powered by Stripe
          </span>
          <span className="flex items-center gap-1">
            <span>↩️</span>
            30-day guarantee
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
