import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  withKeyboard?: boolean;
  paddingTop?: boolean;
  paddingBottom?: boolean;
  backgroundColor?: string;
}

export const ScreenWrapper = ({
  children,
  withKeyboard = true,
  paddingTop = true,
  paddingBottom = true,
  backgroundColor = '#000', // Default to your app's theme
}: Props) => {
  const insets = useSafeAreaInsets();

  // We apply insets as padding to the outer container
  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      paddingTop: paddingTop ? insets.top : 0,
      paddingBottom: paddingBottom ? insets.bottom : 0,
    },
  ];

  const content = <View style={styles.flex}>{children}</View>;

  return (
    <View style={containerStyle}>
      {withKeyboard ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {content}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});
