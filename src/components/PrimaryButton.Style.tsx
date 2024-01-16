import {hp, hpMinMax, wp} from '../helper/ResponsiveDuplicate';
import {StyleSheet} from 'react-native';

const styles = () =>
  StyleSheet.create({
    primaryButtonViewStyle: {
      paddingVertical: hp(14),
      paddingHorizontal: wp(32),
      borderRadius: hp(36),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: 'blue',
    },
    primaryButtonTextStyle: {
      fontSize: hp(18),
      fontWeight: '600',
      textAlign: 'center',
      color: 'white',
    },
  });

export {styles};
