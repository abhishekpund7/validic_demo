import {hp, wp} from '../helper/ResponsiveDuplicate';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: 'white',
    marginHorizontal: wp(16),
    justifyContent: 'center',
  },
  marketPlaceButtonView: {
    flex: 1,
    backgroundColor: 'white',
  },
  appleHealthButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  appleHealthImageStyle: {
    height: hp(32),
    width: hp(32),
    resizeMode: 'contain',
  },
  appleHealthTextStyle: {
    fontSize: wp(24),
    color: 'black',
    fontWeight: '400',
    textAlign: 'left',
    marginLeft: wp(16),
    marginTop: hp(16),
  },
  viewStyle: {
    paddingTop: hp(24),
    paddingBottom: hp(24),
  },
  noteStyle: {
    fontSize: wp(24),
    marginHorizontal: wp(16),
    marginBottom: hp(16),
    color: 'black',
    fontWeight: '400',
    marginTop: hp(24),
  },
});

export {styles};
