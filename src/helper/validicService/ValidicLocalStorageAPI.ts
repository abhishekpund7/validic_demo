import {LocalStorageKey} from '../../LocalStorageKey.constant';
import {AsyncStorageService} from '../AsyncStorageService';
import {
  type HealthMetric,
  type ValidicResponseMarketplace,
} from './ValidicTypes';
import {Platform} from 'react-native';

const asyncStorageService = new AsyncStorageService();

const ValidicLocalStorageAPI = {
  saveUserId: function (validicUserId: string): void {
    AsyncStorageService.saveData(validicUserId, LocalStorageKey.validicUserId);
  },

  getUserId: async function (): Promise<string> {
    const userID = await AsyncStorageService.getData(
      LocalStorageKey.validicUserId,
    );
    return userID;
  },

  saveMobileToken: function (validicMobileToken: string): void {
    AsyncStorageService.saveData(
      validicMobileToken,
      LocalStorageKey.validicMobileToken,
    );
  },

  getMobileToken: async function (): Promise<string> {
    return await AsyncStorageService.getData(
      LocalStorageKey.validicMobileToken,
    );
  },

  saveMarketplaceToken: function (validicMarketplaceToken: string): void {
    AsyncStorageService.saveData(
      validicMarketplaceToken,
      LocalStorageKey.validicMarketplaceToken,
    );
  },

  getMarketplaceToken: async function (): Promise<string> {
    return await AsyncStorageService.getData(
      LocalStorageKey.validicMarketplaceToken,
    );
  },

  saveMarketplaceData: function (
    validicMarketplaceData: ValidicResponseMarketplace[],
  ): void {
    AsyncStorageService.saveData(
      validicMarketplaceData,
      LocalStorageKey.validicMarketplaceData,
    );
  },

  getMarketplaceData: async function (): Promise<ValidicResponseMarketplace[]> {
    const data: ValidicResponseMarketplace[] =
      await AsyncStorageService.getData(LocalStorageKey.validicMarketplaceData);
    const filteredData = data.filter(
      marketPlaceData => marketPlaceData.type === 'fitbit',
    );
    return filteredData;
  },

  getConnectedMarketplaceData: async function (): Promise<string[]> {
    const data: ValidicResponseMarketplace[] = await this.getMarketplaceData();

    const connectedSource: string[] = [];
    // 1
    if (Platform.OS === 'ios') {
      const healthKitEnabled =
        await ValidicLocalStorageAPI.getHealthKitEnabled();

      // console.log('[V] is healthKitEnabled: ', healthKitEnabled)
      if (healthKitEnabled) {
        connectedSource.push('apple_health');
      }
    }
    // 2
    data.forEach(marketPlaceData => {
      if (marketPlaceData.connected && marketPlaceData.type !== undefined) {
        connectedSource.push(marketPlaceData.type);
      }
    });

    console.log('[V] check for iOS');
    console.log('[V] connectedData: ', connectedSource);

    return connectedSource;
  },

  saveHealthKitEnabled: function (healthKitEnabled: boolean): void {
    AsyncStorageService.saveData(
      healthKitEnabled,
      LocalStorageKey.validicHealthKitEnabled,
    );
  },

  getHealthKitEnabled: async function (): Promise<boolean> {
    return await AsyncStorageService.getData(
      LocalStorageKey.validicHealthKitEnabled,
    );
  },

  saveHealthMetrics: function (healthMetrics: HealthMetric[]): void {
    AsyncStorageService.saveData(
      healthMetrics,
      LocalStorageKey.validicHealthMetrics,
    );
  },

  getHealthMetrics: async function (): Promise<HealthMetric[]> {
    return await AsyncStorageService.getData(
      LocalStorageKey.validicHealthMetrics,
    );
  },
};

export default ValidicLocalStorageAPI;
