
import { test, expect } from '@playwright/test';
import { supabase } from '@/integrations/supabase/client';

test.describe('Payment Security Tests', () => {
  test('prevents unauthorized access to payment endpoints', async ({ request }) => {
    // Attempt to access payment endpoint without auth
    const response = await request.post('/api/process-payment', {
      data: {
        amount: 100,
        merchantId: 'test-merchant'
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('validates payment amount limits', async ({ page }) => {
    // Login as merchant
    await page.goto('/auth');
    await page.fill('[data-testid="email-input"]', 'test-merchant@example.com');
    await page.fill('[data-testid="password-input"]', 'testPassword123');
    await page.click('[data-testid="login-button"]');
    
    // Try to process payment above limit
    await page.goto('/pos');
    await page.fill('[data-testid="amount-input"]', '1000000');
    await page.click('[data-testid="process-payment-button"]');
    
    // Verify error message
    expect(await page.textContent('[data-testid="error-message"]'))
      .toContain('Amount exceeds maximum limit');
  });

  test('prevents cross-merchant access', async ({ request }) => {
    // Login as merchant A
    const { data: { session } } = await supabase.auth.signInWithPassword({
      email: 'merchant-a@example.com',
      password: 'testPassword123'
    });

    // Try to access merchant B's transactions
    const response = await request.get('/api/transactions', {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'merchant-id': 'merchant-b-id'
      }
    });
    
    expect(response.status()).toBe(403);
  });

  test('validates CBDC transaction signatures', async ({ page }) => {
    // Login and start CBDC payment
    await page.goto('/auth');
    await page.fill('[data-testid="email-input"]', 'test-merchant@example.com');
    await page.fill('[data-testid="password-input"]', 'testPassword123');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/pos');
    await page.click('[data-testid="add-item-button"]');
    await page.click('[data-testid="checkout-button"]');
    await page.click('[data-testid="cbdc-option"]');
    
    // Try to bypass signature verification
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/cbdc/complete-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: 'test-123',
          signature: 'invalid-signature'
        })
      });
      return res.status;
    });
    
    expect(response).toBe(400);
  });
});
