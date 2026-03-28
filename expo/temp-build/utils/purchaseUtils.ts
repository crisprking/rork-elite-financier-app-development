import { Platform, Alert } from 'react-native';

// Conditional import for in-app purchases
let InAppPurchases: any = null;
if (Platform.OS !== 'web') {
  try {
    InAppPurchases = require('expo-in-app-purchases');
  } catch (error) {
    console.warn('In-app purchases not available:', error);
  }
}

export interface PurchaseProduct {
  productId: string;
  price: string;
  title: string;
  description: string;
  type: 'subscription' | 'consumable' | 'nonConsumable';
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  error?: string;
}

// Product IDs for App Store Connect - Updated to match actual App Store Connect
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'com.rork.finsage.pro.monthly.subscription',
  PRO_ANNUAL: 'com.rork.finsage.pro.annual.subscription',
} as const;

class PurchaseManager {
  private isInitialized = false;
  private products: PurchaseProduct[] = [];

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (Platform.OS === 'web' || !InAppPurchases) {
        console.log('[PurchaseManager] Web platform or IAP not available - purchases not supported');
        return false;
      }

      // Initialize the purchase manager
      await InAppPurchases.connectAsync();
      
      // Get available products
      const products = await InAppPurchases.getProductsAsync([
        PRODUCT_IDS.PRO_MONTHLY,
        PRODUCT_IDS.PRO_ANNUAL,
      ]);

      this.products = products;
      this.isInitialized = true;
      
      console.log('[PurchaseManager] Initialized successfully', { productsCount: products.length });
      return true;
    } catch (error) {
      console.error('[PurchaseManager] Initialization failed:', error);
      return false;
    }
  }

  async getProducts(): Promise<PurchaseProduct[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.products;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: 'Failed to initialize purchase manager' };
        }
      }

      if (Platform.OS === 'web' || !InAppPurchases) {
        return { success: false, error: 'Purchases not supported on web' };
      }

      console.log('[PurchaseManager] Starting purchase for:', productId);

      // Ensure IAP is connected before purchase
      try {
        await InAppPurchases.connectAsync();
      } catch (error) {
        console.warn('[PurchaseManager] Connection check failed, continuing with purchase');
      }

      // Get available products first to ensure product exists
      const products = await InAppPurchases.getProductsAsync([productId]);
      if (!products || products.length === 0) {
        return { success: false, error: 'Product not available. Please try again later.' };
      }

      // Start the purchase
      const result = await InAppPurchases.purchaseItemAsync(productId);
      
      if (result && (result.responseCode === InAppPurchases.IAPResponseCode.OK || result.responseCode === 'OK')) {
        console.log('[PurchaseManager] Purchase successful:', result);
        
        // Verify the purchase with App Store
        const isValid = await this.verifyPurchase(result);
        
        if (isValid) {
          return {
            success: true,
            productId: result.productId,
            transactionId: result.transactionId,
          };
        } else {
          return { success: false, error: 'Purchase verification failed' };
        }
      } else {
        const errorMessage = this.getErrorMessage(result?.responseCode);
        console.error('[PurchaseManager] Purchase failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('[PurchaseManager] Purchase error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async restorePurchases(): Promise<PurchaseResult[]> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return [{ success: false, error: 'Failed to initialize purchase manager' }];
        }
      }

      if (Platform.OS === 'web' || !InAppPurchases) {
        return [{ success: false, error: 'Purchases not supported on web' }];
      }

      console.log('[PurchaseManager] Restoring purchases...');

      const results = await InAppPurchases.getPurchaseHistoryAsync();
      const restoredPurchases: PurchaseResult[] = [];

      for (const purchase of results) {
        if (purchase.responseCode === InAppPurchases.IAPResponseCode.OK) {
          const isValid = await this.verifyPurchase(purchase);
          
          if (isValid) {
            restoredPurchases.push({
              success: true,
              productId: purchase.productId,
              transactionId: purchase.transactionId,
            });
          }
        }
      }

      console.log('[PurchaseManager] Restored purchases:', restoredPurchases.length);
      return restoredPurchases;
    } catch (error) {
      console.error('[PurchaseManager] Restore error:', error);
      return [{ success: false, error: error instanceof Error ? error.message : 'Unknown error' }];
    }
  }

  private async verifyPurchase(purchase: any): Promise<boolean> {
    try {
      // In a production app, you would verify the purchase with your server
      // For now, we'll do basic validation
      
      if (!purchase.productId || !purchase.transactionId) {
        return false;
      }

      // Check if the product ID is valid
      const validProductIds = Object.values(PRODUCT_IDS);
      if (!validProductIds.includes(purchase.productId)) {
        console.warn('[PurchaseManager] Invalid product ID:', purchase.productId);
        return false;
      }

      // In production, you would:
      // 1. Send the receipt to your server
      // 2. Verify with Apple's servers
      // 3. Check for sandbox vs production receipts
      // 4. Validate the purchase date and subscription status
      
      console.log('[PurchaseManager] Purchase verified:', purchase.productId);
      return true;
    } catch (error) {
      console.error('[PurchaseManager] Verification error:', error);
      return false;
    }
  }

  private getErrorMessage(responseCode: any): string {
    if (!InAppPurchases) {
      return 'In-app purchases not available';
    }
    
    switch (responseCode) {
      case InAppPurchases.IAPResponseCode?.USER_CANCELED:
        return 'Purchase was canceled';
      case InAppPurchases.IAPResponseCode?.PAYMENT_INVALID:
        return 'Payment is invalid';
      case InAppPurchases.IAPResponseCode?.PAYMENT_NOT_ALLOWED:
        return 'Payment not allowed';
      case InAppPurchases.IAPResponseCode?.STORE_PRODUCT_NOT_AVAILABLE:
        return 'Product not available';
      case InAppPurchases.IAPResponseCode?.CLOUD_SERVICE_PERMISSION_DENIED:
        return 'Cloud service permission denied';
      case InAppPurchases.IAPResponseCode?.CLOUD_SERVICE_NETWORK_CONNECTION_FAILED:
        return 'Network connection failed';
      case InAppPurchases.IAPResponseCode?.CLOUD_SERVICE_REVOKED:
        return 'Cloud service revoked';
      default:
        return 'Purchase failed with unknown error';
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
        console.log('[PurchaseManager] Disconnected');
      }
    } catch (error) {
      console.error('[PurchaseManager] Disconnect error:', error);
    }
  }
}

export const purchaseManager = new PurchaseManager();
