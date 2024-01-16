import React from 'react';

import {TouchableOpacity, Text, TextStyle} from 'react-native';

import {styles} from './PrimaryButton.Style';

import {hp, hpMinMax, wp} from '../helper/ResponsiveDuplicate';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  id?: string;
  marginTop?: number;
  disabled?: boolean;
  width?: number | string;
  popTextSize?: number;
}

const PrimaryButton = ({
  title,
  onPress,
  marginTop = hp(16),
  disabled = false,
  width = '100%',
  id = 'primaryButton',
  popTextSize,
}: PrimaryButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      testID={id}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles().primaryButtonViewStyle,
        {
          marginTop,
          width,
        },
      ]}>
      <Text style={styles().primaryButtonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
