import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

type WebviewScreenRouteProp = RouteProp<{
  WebviewScreen: {url: string; title: string};
}>;

const WebviewScreen: React.FC = () => {
  const route = useRoute<WebviewScreenRouteProp>();
  const navigation = useNavigation();
  const ref = useRef(null);
  const [uri, setUri] = useState(route.params.url);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    });
  }, []);

  function handleNavigationStateChange(state: {title: string; url: string}) {
    // Fitbit auth
    if (state.url.includes('https://www.fitbit.com/oauth2')) {
      const defaultScope =
        '&scope=activity+heartrate+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+weight';
      const desiredScope = '&scope=profile+heartrate+oxygen_saturation';
      setUri(state.url.replace(defaultScope, desiredScope));
    }

    // iHealth auth
    if (state.url.includes('OpenApiV2/OAuthv2/userauthorization')) {
      const defaultScope =
        '?APIName=OpenApiActivity+OpenApiBG+OpenApiBP+OpenApiFood+OpenApiSleep+OpenApiSpO2+OpenApiSport+OpenApiUserInfo+OpenApiWeight';
      const desiredScope = '?APIName=OpenApiActivity+OpenApiSpO2+OpenApiSport';
      setUri(state.url.replace(defaultScope, desiredScope));
    }

    // Completed auth
    if (state.url.includes('https://syncmydevice.com/?token=')) {
      DeviceEventEmitter.emit('connectwearablewebview.onconnectcomplete');
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <WebView
          ref={ref}
          source={{uri}}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              style={styles.activityIndicator}
              color={'black'}
              size="large"
            />
          )}
          onNavigationStateChange={state => {
            handleNavigationStateChange(state);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  activityIndicator: {
    height: '100%',
    width: '100%',
  },
});
