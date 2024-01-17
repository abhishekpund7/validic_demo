import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  NativeEventEmitter,
  NativeModules,
  Alert,
} from 'react-native';
import {styles} from './WebviewScreen.Style';
import PrimaryButton from '../components/PrimaryButton';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
  HealthObserver,
  HealthUnit,
} from 'react-native-health';

const HomeScreen = () => {
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.OxygenSaturation,
      ],
      write: [],
    },
  } as HealthKitPermissions;

  const [heartRateMatric, setHeartRateMatric] = useState<HealthValue[]>([]);

  const [oxygenSaturationMatric, setOxygenSaturation] = useState<HealthValue[]>(
    [],
  );

  useEffect(() => {
    if (oxygenSaturationMatric.length !== 0) {
      oxygenSaturationMatric.map((item, index) => {
        // console.log('Oxygen Saturation', new Date(item.endDate), item.value);
        if (index === 0) {
          // Alert.alert(
          //   `New Oxygen Saturation Record\n${new Date(
          //     item.endDate,
          //   )}\nOxygen Saturation: ${item.value}`,
          // );
        }
      });
    }
  }, [oxygenSaturationMatric]);

  useEffect(() => {
    if (heartRateMatric.length !== 0) {
      heartRateMatric.map((item, index) => {
        // console.log('Heart Rate', new Date(item.endDate), item.value);
        if (index === 0) {
          // Alert.alert(
          //   `New Heart Rate Record\n${new Date(item.endDate)}\nHeart Rate: ${
          //     item.value
          //   }`,
          // );
        }
      });
    }
  }, [heartRateMatric]);

  useEffect(() => {
    const healthKitEmitter = new NativeEventEmitter(
      NativeModules.AppleHealthKit,
    );

    const subscription = healthKitEmitter.addListener(
      'healthKit:HeartRate:new',
      data => {
        console.log('[O] --> healthKit:HeartRate:new observer triggered', data);
        getHeartRateSamples();
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const isAppleHealthKitAvailable = () => {
    AppleHealthKit.isAvailable((error: Object, available: boolean) => {
      if (error) {
        console.log('[ERROR] initializing Healthkit: ', error);
        return;
      }

      console.log('isAppleHealthKitAvailable: ', available);

      initHealthKit();
    });
  };

  const initHealthKit = (): void => {
    // Start Loader
    AppleHealthKit.initHealthKit(
      permissions,
      (error: string, result: HealthValue) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!', error);
          return;
        }

        // Stop Loader
        console.log('Initialized Healthkit', result);
        /* Can now read or write to HealthKit */
        getOxygenSaturationSamples();
        getHeartRateSamples();
      },
    );
  };

  const getOxygenSaturationSamples = () => {
    const date = new Date();
    date.setDate(date.getDate() - 2);

    const options: HealthInputOptions = {
      startDate: date.toISOString(),
      endDate: new Date().toISOString(),
    };

    AppleHealthKit.getOxygenSaturationSamples(
      options,
      (error: string, results: HealthValue[]) => {
        if (error) {
          console.log('getOxygenSaturationSamples error', error);
          return;
        }

        /* Samples are now collected from HealthKit */
        console.log('getOxygenSaturationSamples', error, results);
        setOxygenSaturation(results);
      },
    );
  };

  const getHeartRateSamples = () => {
    const date = new Date();
    date.setDate(date.getDate() - 2);

    const options: HealthInputOptions = {
      startDate: date.toISOString(),
      endDate: new Date().toISOString(),
    };

    AppleHealthKit.getHeartRateSamples(
      options,
      (error: string, results: HealthValue[]) => {
        if (error) {
          console.log('getHeartRateSamples error', error);
          return;
        }

        /* Samples are now collected from HealthKit */
        console.log('getHeartRateSamples', error, results);
        setHeartRateMatric(results);
      },
    );
  };

  const handlePressGetAuthStatus = () => {
    AppleHealthKit.getAuthStatus(permissions, (error, result) => {
      if (error) {
        console.log('getAuthStatus error', error);
        return;
      }

      console.log('getAuthStatus response', result);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}>
        <PrimaryButton
          title={'Rest API'}
          onPress={() => {
            isAppleHealthKitAvailable();
          }}
          marginTop={0}
        />
        {/* <PrimaryButton
          title={'Get Auth Status'}
          onPress={() => {
            handlePressGetAuthStatus();
          }}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
