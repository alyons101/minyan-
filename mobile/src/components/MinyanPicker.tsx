import React from 'react';
import { Platform } from 'react-native';
import { Picker as NativePicker } from '@react-native-picker/picker';

export const MinyanPicker = (props: any) => {
  if (Platform.OS === 'web') {
    return (
        <select
          value={props.selectedValue}
          onChange={(e) => props.onValueChange(e.target.value)}
          style={{
            height: 40,
            width: '100%',
            padding: 5,
            fontSize: 16,
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 6,
            backgroundColor: 'white',
            marginBottom: 10
          }}
        >
          {props.children}
        </select>
    );
  }
  return <NativePicker {...props} />;
};

export const MinyanPickerItem = (props: any) => {
    if (Platform.OS === 'web') {
        return <option value={props.value}>{props.label}</option>;
    }
    return <NativePicker.Item {...props} />;
};

MinyanPicker.Item = MinyanPickerItem;
