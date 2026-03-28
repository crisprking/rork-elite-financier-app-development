import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Mock IAP implementation for development
const mockIAP = {
  connectAsync: async () => true,
  getProductsAsync: async (productIds: string[]) => {
    console.log('Mock: Getting products for:', productIds);
    return { responseCode: 'OK', results: [] };
  },
  purchaseItemAsync: async (productId: string) => {
    console.log('Mock: Purchasing product:', productId);
    return { 
      responseCode: 'OK', 
      productId, 
      transactionId: `mock_${Date.now()}` 
    };
  },
  getPurchaseHistoryAsync: async () => {
    console.log('Mock: Getting purchase history');
    return { responseCode: 'OK', results: [] };
  }
};

// Use mock IAP for development
const InAppPurchases = mockIAP;

// Product IDs for in-app purchases - Updated to match App Store Connect
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'com.rork.nest.focus.monthly.subscription',
  PREMIUM_ANNUAL: 'com.rork.nest.focus.annual.subscription',
  AI_BOOST_PACK: 'com.rork.lunarising.aiboost.pack',
} as const;

interface SubscriptionContextType {
  isPremium: boolean;
  aiBoostsRemaining: number;
  isLoading: boolean;
  purchasePremium: (productId: string) => Promise<void>;
  purchaseAIBoost: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  useAIBoost: () => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [aiBoostsRemaining, setAiBoostsRemaining] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeSubscription();
  }, []);

  const initializeSubscription = async () => {
    try {
      if (Platform.OS === 'web') return;

      // Initialize In-App Purchases
      const isConnected = await InAppPurchases.connectAsync();
      if (!isConnected) {
        console.error('Failed to connect to App Store');
        return;
      }

      // Get available products
      const products = await InAppPurchases.getProductsAsync([
        PRODUCT_IDS.PREMIUM_MONTHLY,
        PRODUCT_IDS.PREMIUM_ANNUAL,
        PRODUCT_IDS.AI_BOOST_PACK,
      ]);

      console.log('Available products:', products);

      // Load saved subscription status
      const savedPremium = await AsyncStorage.getItem('isPremium');
      const savedBoosts = await AsyncStorage.getItem('aiBoostsRemaining');
      
      if (savedPremium === 'true') {
        setIsPremium(true);
      }
      
      if (savedBoosts) {
        setAiBoostsRemaining(parseInt(savedBoosts, 10));
      }

    } catch (error) {
      console.error('Error initializing subscription:', error);
    }
  };

    const purchasePremium = async (productId: string) => {
    try {
      setIsLoading(true);

      if (Platform.OS === 'web') {
        Alert.alert('Web Not Supported', 'In-app purchases are not supported on web. Please use a mobile device.');
        return;
      }

      // Start the purchase
      const result = await InAppPurchases.purchaseItemAsync(productId);
      
      if (result && result.responseCode === 'OK') {
        // Verify the purchase
        const isValid = await verifyPurchase(result);
        
        if (isValid) {
          setIsPremium(true);
          await AsyncStorage.setItem('isPremium', 'true');

          Alert.alert(
            'Welcome to Premium!',
            'You now have unlimited AI insights and premium features.',
            [{ text: 'Awesome!', style: 'default' }]
          );
        } else {
          Alert.alert('Error', 'Purchase verification failed. Please try again.');
        }
      } else {
        const errorMessage = getErrorMessage(result?.responseCode);
        Alert.alert('Purchase Failed', errorMessage);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

    const purchaseAIBoost = async () => {
    try {
      setIsLoading(true);

      if (Platform.OS === 'web') {
        Alert.alert('Web Not Supported', 'In-app purchases are not supported on web. Please use a mobile device.');
        return;
      }

      // Start the purchase
      const result = await InAppPurchases.purchaseItemAsync(PRODUCT_IDS.AI_BOOST_PACK);
      
      if (result && result.responseCode === 'OK') {
        // Verify the purchase
        const isValid = await verifyPurchase(result);
        
        if (isValid) {
          const newBoosts = aiBoostsRemaining + 50; // Add 50 AI boosts
          setAiBoostsRemaining(newBoosts);
          await AsyncStorage.setItem('aiBoostsRemaining', newBoosts.toString());

          Alert.alert(
            'AI Boosts Added!',
            'You now have 50 additional AI boosts.',
            [{ text: 'Great!', style: 'default' }]
          );
        } else {
          Alert.alert('Error', 'Purchase verification failed. Please try again.');
        }
      } else {
        const errorMessage = getErrorMessage(result?.responseCode);
        Alert.alert('Purchase Failed', errorMessage);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);

      if (Platform.OS === 'web') {
        Alert.alert('Web Not Supported', 'In-app purchases are not supported on web. Please use a mobile device.');
        return;
      }

      const result = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (result && result.responseCode === 'OK') {
        // Check for premium purchases
        const hasPremium = result.results?.some((purchase: any) => 
          purchase.productId === PRODUCT_IDS.PREMIUM_MONTHLY || 
          purchase.productId === PRODUCT_IDS.PREMIUM_ANNUAL
        );

        if (hasPremium) {
          setIsPremium(true);
          await AsyncStorage.setItem('isPremium', 'true');
          Alert.alert('Purchases Restored', 'Your premium subscription has been restored.');
        } else {
          Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
        }
      } else {
        Alert.alert('Error', 'Failed to restore purchases. Please try again.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const useAIBoost = (): boolean => {
    if (isPremium) {
      return true; // Unlimited for premium users
    }

    if (aiBoostsRemaining > 0) {
      const newBoosts = aiBoostsRemaining - 1;
      setAiBoostsRemaining(newBoosts);
      AsyncStorage.setItem('aiBoostsRemaining', newBoosts.toString());
      return true;
    }

    return false; // No boosts remaining
  };

  const verifyPurchase = async (purchase: any): Promise<boolean> => {
    try {
      // Basic validation
      if (!purchase.productId || !purchase.transactionId) {
        console.warn('Missing required purchase data');
        return false;
      }

      // Check if the product ID is valid
      const validProductIds = Object.values(PRODUCT_IDS);
      if (!validProductIds.includes(purchase.productId)) {
        console.warn('Invalid product ID:', purchase.productId);
        return false;
      }

      // For development and testing, use basic validation
      // In production, you would implement server-side receipt validation
      console.log('Purchase verified with basic validation:', purchase.productId);
      return true;
    } catch (error) {
      console.error('Purchase verification failed:', error);
      return false;
    }
  };

  const getErrorMessage = (responseCode: any): string => {
    switch (responseCode) {
      case 'USER_CANCELED':
        return 'Purchase was canceled';
      case 'PAYMENT_INVALID':
        return 'Payment is invalid';
      case 'PAYMENT_NOT_ALLOWED':
        return 'Payment not allowed';
      case 'STORE_PRODUCT_NOT_AVAILABLE':
        return 'Product not available';
      case 'CLOUD_SERVICE_PERMISSION_DENIED':
        return 'Cloud service permission denied';
      case 'CLOUD_SERVICE_NETWORK_CONNECTION_FAILED':
        return 'Network connection failed';
      case 'CLOUD_SERVICE_REVOKED':
        return 'Cloud service revoked';
    default:
        return 'Purchase failed with unknown error';
    }
  };

  const value: SubscriptionContextType = {
    isPremium,
    aiBoostsRemaining,
    isLoading,
    purchasePremium,
    purchaseAIBoost,
    restorePurchases,
    useAIBoost,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};