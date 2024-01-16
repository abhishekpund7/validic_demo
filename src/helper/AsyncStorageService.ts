import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  static saveData(data: any, key: string): void {
    AsyncStorage.setItem(key, JSON.stringify(data)).catch(() => {
      console.log(`[error] failed to set item in async storage: ${key}`);
    });
  }

  static async getData(key: string): Promise<any> {
    try {
      const result = await AsyncStorage.getItem(key);
      if (result != null) return JSON.parse(result);
    } catch (error) {
      return undefined;
    }
  }

  static deleteData(key: string): void {
    AsyncStorage.removeItem(key).catch(() => {
      console.error('[error] failed to delete item from async storage:', key);
    });
  }

  static removeAllAsyncData(): void {
    AsyncStorage.clear().catch(error => {
      console.error(
        '[error] failed to remove all items from async storage: ',
        error,
      );
    });
  }
}
