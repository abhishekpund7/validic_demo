import { Dimensions, PixelRatio } from 'react-native';

const designHeight: number = 568; // iPhone 8: 667 // SE: 568

const designWidth: number = 320; // iPhone 8: 375 // SE: 320

const screenWidth: number = Dimensions.get('window').width;

const screenHeight: number = Dimensions.get('window').height;

const widthPercentageToDP = (widthPercent: number): number => {
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

const heightPercentageToDP = (heightPercent: number): number => {
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

const hp = (px: number): number => {
  const strPercent = ((px / designHeight) * 100).toFixed(2);
  return heightPercentageToDP(parseFloat(strPercent));
};

const hpMinMax = ( min: number, max: number): number => {
  if (screenHeight>= 844) {
    return max
  } else if (screenHeight <= 667) {
    return min
  } else {
    return (min+max)/2
  }
};

const wp = (px: number): number => {
  const strPercent = ((px / designWidth) * 100).toFixed(2);
  return widthPercentageToDP(parseFloat(strPercent));
};

export { hp, wp, hpMinMax, designHeight, designWidth };
