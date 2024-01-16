import React from 'react';

import {TouchableOpacity, Text, TextStyle} from 'react-native';

import {styles} from './SecondaryButton.Style';

import {hp, wp} from '../helper/ResponsiveDuplicate';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  marginTop?: number;
  disabled?: boolean;
  width?: number | string;
  popTextSize?: number;
  id?: string;
}

const SecondaryButton = ({
  title,
  onPress,
  marginTop = hp(16),
  disabled = false,
  width = '100%',
  id = 'secondaryButton',
  popTextSize,
}: SecondaryButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles().secondaryButtonViewStyle, {marginTop, width}]}
      testID={id}>
      <Text style={styles().secondaryButtonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
