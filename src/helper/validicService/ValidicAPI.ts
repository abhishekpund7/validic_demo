import axios, {type AxiosResponse} from 'axios';
import {AppState, Platform} from 'react-native';
import {
  type ValidicResponseUser,
  type ValidicResponseMarketplace,
  type HealthMetric,
  type ValidicResponseData,
  ValidicResponseDatum,
} from './ValidicTypes';
import ValidicLocalStorageAPI from './ValidicLocalStorageAPI';
import ValidicSession, {
  ValidicSessionEvents,
  ValidicLog,
  type User,
} from 'react-native-validic-session';
import ValidicHealthKit, {
  SampleTypes,
  ValidicHealthKitEvents,
} from 'react-native-validic-aggregator-ios';
import {CredConstants, LocalStorageKey} from '../../LocalStorageKey.constant';

const validic = axios.create({baseURL: 'https://api.v2.validic.com'});
const marketplace = axios.create({baseURL: 'https://syncmydevice.com'});

marketplace.interceptors.response.use(
  (data: AxiosResponse<any, any>) => {
    console.log(
      '[V] MarketPlace API response: ',
      data.config.method,
      String(data.config.baseURL) + String(data.config.url),
      data.config.params,
      data.data,
    );
    return data;
  },
  async (error: any) => {
    console.log(
      '[V] MarketPlace API error: ',
      error,
      error.response?.data,
      error.message,
      error.request.url,
    );
    return await Promise.reject(error);
  },
);

validic.interceptors.response.use(
  (data: AxiosResponse<any, any>) => {
    console.log(
      '[V] Validic API response: ',
      data.config.method,
      String(data.config.baseURL) + String(data.config.url),
      data.config.params,
      data.data,
    );
    return data;
  },
  async (error: any) => {
    console.log(
      '[V] Validic API error: ',
      error,
      error.response?.data,
      error.message,
      error.request.url,
    );
    return await Promise.reject(error);
  },
);

const ValidicHealthKitSubscriptions = [
  SampleTypes.HKQuantityTypeIdentifierOxygenSaturation,
  SampleTypes.HKQuantityTypeIdentifierHeartRate,
];

const ValidicPrivateAPI = {
  openSession: async function () {
    void ValidicSession.startSession({
      user_id: await ValidicLocalStorageAPI.getUserId(),
      user_token: await ValidicLocalStorageAPI.getMobileToken(),
      org_id: CredConstants.ORG_ID,
    });
    console.log('[V] Started new Validic session');
  },

  provisionUser: async function (): Promise<
    AxiosResponse<ValidicResponseUser, any>
  > {
    console.log('[V] provisionUser: ');
    const url = `/organizations/${CredConstants.ORG_ID}/users?token=${CredConstants.TOKEN}`;
    const data = {
      uid: CredConstants.PATIENT_ID,
      location: {
        timezone: 'America/Los_Angeles',
        country_code: 'US',
      },
    };
    console.log('[V] provisionUser: ', CredConstants.PATIENT_ID, url, data);

    return await validic.post(url, data);
  },

  getOrCreateUser: async function (): Promise<ValidicResponseUser> {
    try {
      const userInfoResponse = await this.getUserInfo();
      console.log('[V] userInfoResponse: ', userInfoResponse.data);
      const newUser = userInfoResponse.data.sources.length === 0;
      console.log('[V] newUser', newUser);
      return userInfoResponse.data;
    } catch (error) {
      console.log('[V] getOrCreateUser error: ', error.response.status);
      if (error.response.status === 404) {
        console.log('[V] Provisioning new validic user');
        const userInfo = (await this.provisionUser()).data;
        return userInfo;
      } else {
        // console.log('[V] throw error: ', error);
        throw error;
      }
    }
  },

  getUserInfo: async function (): Promise<
    AxiosResponse<ValidicResponseUser, any>
  > {
    const url = `/organizations/${CredConstants.ORG_ID}/users/${CredConstants.PATIENT_ID}?token=${CredConstants.TOKEN}`;
    try {
      const abc = await validic.get(url);
      return abc;
    } catch (error) {
      console.log('[V] getUserInfo throw error: ', error);
      throw error;
    }
  },

  saveValidicUserInfo: function (userInfo: ValidicResponseUser): void {
    ValidicLocalStorageAPI.saveUserId(userInfo.id);
    ValidicLocalStorageAPI.saveMobileToken(userInfo.mobile.token);
    ValidicLocalStorageAPI.saveMarketplaceToken(userInfo.marketplace.token);
  },

  getMarketplaceData: async function (): Promise<
    AxiosResponse<ValidicResponseMarketplace[], any>
  > {
    const marketplaceToken = await ValidicLocalStorageAPI.getMarketplaceToken();
    if (marketplaceToken === undefined || marketplaceToken === null) {
      console.log('[V] market place token not present');
      // throw new Error(Strings.ErrorBoundary.errorMesage);
    }
    console.log('[V] market place token', marketplaceToken);
    const url = `?token=${marketplaceToken}&format=json`;
    return await marketplace.get(url);
  },

  isSessionStarted: async function (): Promise<User | null> {
    return await ValidicSession.getUser();
  },

  endSession: function () {
    ValidicSession.endSession();
  },

  setHealthKitBackgroundUpdate: function () {
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('[V] ValidicHealthKit observeCurrentSubscriptions');
        ValidicHealthKit.observeCurrentSubscriptions();
      }
    });
  },

  // YYYY-MM-DD
  getTodayString: function (): string {
    return new Date().toJSON().slice(0, 10);
  },

  // YYYY-MM-DD
  getLastWeekString: function (): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toJSON().slice(0, 10);
  },

  fetchMeasurements: async function (
    source: string,
  ): Promise<AxiosResponse<ValidicResponseData>> {
    const url = `/organizations/${CredConstants.ORG_ID}/users/${CredConstants.PATIENT_ID}/measurements`;
    const params = {
      token: CredConstants.TOKEN,
      start_date: this.getLastWeekString(),
      end_date: this.getTodayString(),
      source,
    };

    return await validic.get(url, {params});
  },

  fetchSummaries: async function (
    source: string,
  ): Promise<AxiosResponse<ValidicResponseData>> {
    const url = `/organizations/${CredConstants.ORG_ID}/users/${CredConstants.PATIENT_ID}/summaries`;
    const params = {
      token: CredConstants.TOKEN,
      start_date: this.getLastWeekString(),
      end_date: this.getTodayString(),
      source,
    };

    return await validic.get(url, {params});
  },

  fetchAllMetrics: async function (): Promise<ValidicResponseDatum[]> {
    let healthMetrics: ValidicResponseDatum[] = [];
    // 1
    const connectedSource =
      await ValidicLocalStorageAPI.getConnectedMarketplaceData();

    if (connectedSource.length > 0) {
      // 2
      for (const source of connectedSource) {
        // console.log('[V] Fetching metrics for source: ', source)
        const measurements = await this.fetchMeasurements(source);
        const summaries = await this.fetchSummaries(source);

        healthMetrics = healthMetrics.concat(measurements.data.data);
        healthMetrics = healthMetrics.concat(summaries.data.data);
      }
    }
    return healthMetrics;
  },
};

const ValidicAPI = {
  startValidicSession: async function (): Promise<void> {
    // 1 is validic session started then get userID
    const isValidicSessionStarted = await ValidicPrivateAPI.isSessionStarted();
    console.log('[V] isValidicSessionStarted ', isValidicSessionStarted);

    // 2
    if (isValidicSessionStarted !== null) {
      // 2.1
      const currentPairedUser = await ValidicPrivateAPI.getUserInfo();
      // console.log('[V] current paired user', currentPairedUser)
      try {
        // 2.2
        if (currentPairedUser.data.id === isValidicSessionStarted.user_id) {
          // console.log('[V] same user')
          await ValidicAPI.updateMarketplaceData();
          ValidicAPI.removeListeners();
          ValidicAPI.addListeners();
          await ValidicAPI.updateHealthKit();
        } else {
          console.log('[V] 1 initializationSequence');
          await ValidicAPI.initializationSequence();
        }
      } catch {
        // 2.3
        console.log('[V] 2 initializationSequence');
        await ValidicAPI.initializationSequence();
      }
    } else {
      // 3
      console.log('[V] 3 initializationSequence');
      await ValidicAPI.initializationSequence();
    }
  },

  initializeUser: async function (): Promise<void> {
    try {
      const userInfo = await ValidicPrivateAPI.getOrCreateUser();
      console.log('[V] initializeUser ', userInfo);
      ValidicPrivateAPI.saveValidicUserInfo(userInfo);
    } catch (error) {
      console.log('[V] initializeUser error', error);
    }
  },

  updateMarketplaceData: async function (): Promise<void> {
    try {
      const marketplaceData = await ValidicPrivateAPI.getMarketplaceData();
      console.log('[V] received MarketplaceData', marketplaceData.data);
      ValidicLocalStorageAPI.saveMarketplaceData(marketplaceData.data);
    } catch (error) {
      console.log('[V] fail to get MarketplaceData ', error);
      throw error;
    }
  },

  initializeSession: async function (): Promise<boolean> {
    if ((await ValidicPrivateAPI.isSessionStarted()) != null) {
      console.log('[V] Validic session already started');
      return false;
    } else {
      console.log('[V] Validic openSession');
      await ValidicPrivateAPI.openSession();
      return true;
    }
  },

  addListeners: function () {
    // the record was successfully uploaded to validic servers
    ValidicSessionEvents.addListener('validic:session:onsuccess', record => {
      console.log(
        `[V] Validic record received of type ${record.record_type as string}`,
        record,
      );
    });

    // an error was returned while submitting the record
    ValidicSessionEvents.addListener('validic:session:onerror', event => {
      console.log(`[V] Got validic session error: ${event as string}`);
    });

    ValidicHealthKitEvents.addListener('validic:healthkit:onrecords', event => {
      console.log('[V] Got HealthKit record: ', event);
    });

    // the session was ended
    ValidicSessionEvents.addListener('validic:session:onend', event => {
      console.log(`[V] Validic session ended: ${event as string}`);
    });
  },

  removeListeners: function () {
    ValidicSessionEvents.removeAllListeners('validic:session:onsuccess');
    ValidicSessionEvents.removeAllListeners('validic:session:onerror');
    ValidicSessionEvents.removeAllListeners('validic:healthkit:onrecords');
    ValidicSessionEvents.removeAllListeners('validic:session:onend');
  },

  updateHealthKit: async function () {
    if (Platform.OS !== 'ios') return;

    const healthKitEnabled = await ValidicLocalStorageAPI.getHealthKitEnabled();
    console.log('[V] ishealthKitEnabled: ', healthKitEnabled);
    if (healthKitEnabled) {
      ValidicPrivateAPI.setHealthKitBackgroundUpdate();
    } else {
      console.log('[V] ishealthKitEnabled: set subscription empty');
    }
  },

  initializationSequence: async function () {
    console.log('[V] Initialize User');
    ValidicLog.enable();
    try {
      await ValidicAPI.initializeUser();
      await ValidicAPI.updateMarketplaceData();
      // start validic session
      await ValidicAPI.initializeSession();
      ValidicAPI.addListeners();
      await ValidicAPI.updateHealthKit();
      console.log('[V] initializationSequence success');
    } catch {
      console.log('[V][V] initializationSequence error');
    }
  },

  updateHealthMetrics: async function () {
    const healthMetrics: ValidicResponseDatum[] =
      await ValidicPrivateAPI.fetchAllMetrics();
    console.log('[V] fetchAllMetrics', healthMetrics);
    // ValidicLocalStorageAPI.saveHealthMetrics(healthMetrics);
  },

  cleanUpSequence: function () {
    console.log('[V] cleanUpSequence');
    ValidicAPI.removeListeners();
    ValidicPrivateAPI.endSession();
  },
};

export default ValidicAPI;
