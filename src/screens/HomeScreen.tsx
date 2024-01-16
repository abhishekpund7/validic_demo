import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  Platform,
  DeviceEventEmitter,
  View,
} from 'react-native';
import ValidicAPI from '../helper/validicService/ValidicAPI';
import {styles} from './WebviewScreen.Style';
import {useNavigation} from '@react-navigation/native';
import ValidicLocalStorageAPI from '../helper/validicService/ValidicLocalStorageAPI';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import {hp} from '../helper/ResponsiveDuplicate';
import {ValidicResponseMarketplace} from '../helper/validicService/ValidicTypes';
import ValidicHealthKit, {
  SampleTypes,
} from 'react-native-validic-aggregator-ios';

const HomeScreen = () => {
  const [marketplaceData, setMarketplaceData] = useState<
    ValidicResponseMarketplace[]
  >([]);
  const [healthKitEnabled, setHealthKitEnabled] = useState<boolean>(false);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    ValidicAPI.startValidicSession()
      .then(() => {
        console.log('[V] startValidicSession success');
      })
      .catch(error => {
        console.log('[V] startValidicSession error', error);
      });

    getHealthKitEnabledFromLocalStorage()
      .then(() => {})
      .catch(() => {});
    getMarketplaceDataFromLocalStorage()
      .then(() => {})
      .catch(() => {});

    DeviceEventEmitter.addListener(
      'connectwearablewebview.onconnectcomplete',
      () => {
        setLoading(true);
        ValidicAPI.updateMarketplaceData()
          .then(async () => {
            await getMarketplaceDataFromLocalStorage();
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
        navigation.pop(1);
      },
    );

    return () => {
      DeviceEventEmitter.removeAllListeners(
        'connectwearablewebview.onconnectcomplete',
      );
    };
  }, []);

  useEffect(() => {
    if (healthKitEnabled) {
      ValidicHealthKit.getCurrentSubscriptions((subscriptions: any) => {
        console.log('[V] Healtkit getCurrentSubscriptions is ', subscriptions);
      });
    }
  }, [healthKitEnabled]);

  async function getHealthKitEnabledFromLocalStorage() {
    setHealthKitEnabled(await ValidicLocalStorageAPI.getHealthKitEnabled());
  }

  const ValidicHealthKitSubscriptions = [
    SampleTypes.HKQuantityTypeIdentifierOxygenSaturation,
    SampleTypes.HKQuantityTypeIdentifierHeartRate,
  ];

  async function getMarketplaceDataFromLocalStorage() {
    const data: ValidicResponseMarketplace[] =
      await ValidicLocalStorageAPI.getMarketplaceData();
    setMarketplaceData(data);
  }

  function handleAppleHealthButtonPress(): void {
    if (healthKitEnabled) {
      console.log('[V] Clearing Subscription');
      ValidicHealthKit.setSubscriptions([]);
    } else {
      ValidicHealthKit.setSubscriptions([]);
      ValidicHealthKit.setSubscriptions(ValidicHealthKitSubscriptions);
    }

    setHealthKitEnabled(!healthKitEnabled);
    ValidicLocalStorageAPI.saveHealthKitEnabled(!healthKitEnabled);

    ValidicAPI.updateHealthKit()
      .then(data => {
        // console.log('[V] in updateHealthKit', data);
      })
      .catch(error => {
        // console.log('[V] error in updateHealthKit', error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}>
        <PrimaryButton
          title={'Rest API'}
          onPress={() => {
            ValidicAPI.updateHealthMetrics();
          }}
          marginTop={0}
        />
        {Platform.OS === 'ios' && (
          <View style={{marginTop: hp(32)}}>
            <Text style={styles.appleHealthTextStyle}>{'Apple Health'}</Text>
            {healthKitEnabled ? (
              <SecondaryButton
                title={'Disconnect'}
                onPress={handleAppleHealthButtonPress}
                marginTop={hp(16)}
              />
            ) : (
              <PrimaryButton
                title={'Connect'}
                onPress={handleAppleHealthButtonPress}
                marginTop={hp(16)}
              />
            )}
          </View>
        )}
        {marketplaceData.length !== 0 && (
          <View>
            {Object.entries(marketplaceData).map((integration, key) => {
              const name = integration[1].display_name;
              const connected = integration[1].connected;
              const fullUrl = connected
                ? integration[1].disconnect_url
                : integration[1].connect_url;
              const screenTitle =
                (connected ? 'Disconnect' : 'Connect') + ' ' + name;

              return (
                <View style={styles.viewStyle} key={key}>
                  <Text style={[styles.appleHealthTextStyle, {marginTop: 0}]}>
                    {name}
                  </Text>
                  {connected ? (
                    <SecondaryButton
                      title={'Disconnect'}
                      onPress={() => {
                        navigation.push('WebviewScreen', {
                          url: fullUrl,
                          title: screenTitle,
                        });
                      }}
                      marginTop={hp(16)}
                    />
                  ) : (
                    <PrimaryButton
                      title={'Connect'}
                      onPress={() => {
                        navigation.push('WebviewScreen', {
                          url: fullUrl,
                          title: screenTitle,
                        });
                      }}
                      marginTop={hp(16)}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
