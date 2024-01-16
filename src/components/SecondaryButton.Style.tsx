import {hp, hpMinMax, wp} from '../helper/ResponsiveDuplicate';
import {StyleSheet} from 'react-native';

const styles = () =>
  StyleSheet.create({
    secondaryButtonViewStyle: {
      backgroundColor: 'white',
      borderWidth: hp(1),
      borderColor: 'blue',
      borderRadius: hp(36),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      paddingVertical: hp(14),
      paddingHorizontal: wp(32),
    },
    secondaryButtonTextStyle: {
      color: 'blue',
      fontSize: hp(18),
      fontWeight: '600',
      textAlign: 'center',
    },
  });

export {styles};
