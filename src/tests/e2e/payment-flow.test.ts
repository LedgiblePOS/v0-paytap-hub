
import { test, expect } from '@playwright/test';
import { supabase } from '@/integrations/supabase/client';
import { FasstapService } from '@/services/fasstapService';
import { mockPaymentTerminal } from '@/tests/mocks/paymentTerminal';

test.describe('Payment Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test merchant
    await page.goto('/auth');
    await page.fill('[data-testid="email-input"]', 'test-merchant@example.com');
    await page.fill('[data-testid="password-input"]', 'testPassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('complete tap-to-pay payment flow', async ({ page }) => {
    // Mock payment terminal connection
    mockPaymentTerminal();

    // Navigate to POS
    await page.goto('/pos');
    
    // Add items to cart
    await page.click('[data-testid="add-item-button"]');
    await page.click('[data-testid="checkout-button"]');
    
    // Select payment method
    await page.click('[data-testid="tap-to-pay-option"]');
    
    // Verify amount displayed
    const amount = await page.textContent('[data-testid="payment-amount"]');
    expect(amount).toBe('$10.00');
    
    // Process payment
    await page.click('[data-testid="process-payment-button"]');
    
    // Verify success page
    await page.waitForURL('/payment-success');
    expect(await page.textContent('[data-testid="status-message"]'))
      .toContain('Payment Successful');
  });

  test('complete CBDC payment flow', async ({ page }) => {
    // Mock CBDC service
    mockPaymentTerminal({ type: 'CBDC' });

    await page.goto('/pos');
    await page.click('[data-testid="add-item-button"]');
    await page.click('[data-testid="checkout-button"]');
    await page.click('[data-testid="cbdc-option"]');
    
    // Verify CBDC-specific elements
    expect(await page.isVisible('[data-testid="cbdc-warning"]')).toBeTruthy();
    
    await page.click('[data-testid="process-payment-button"]');
    await page.waitForURL('/payment-success');
  });
});
