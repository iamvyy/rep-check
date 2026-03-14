import { useTheme } from '@/features/theme/hooks/use-theme';
import React, { useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

interface FormInputProps<T extends FieldValues> extends TextInputProps {
    name: Path<T>;
    control: Control<T>;
    label: string;
    error?: string;
}

export function FormInput<T extends FieldValues>({
    name,
    control,
    label,
    error,
    style,
    ...textInputProps
}: FormInputProps<T>) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            error ? styles.inputError : null,
                            style,
                        ]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value !== undefined && value !== null ? value.toString() : ''}
                        placeholderTextColor={colors.textSecondary}
                        {...textInputProps}
                    />
                )}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: colors.textPrimary,
        },
        input: {
            height: 48,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            borderRadius: 12,
            paddingHorizontal: 16,
            fontSize: 16,
            color: colors.textPrimary,
            backgroundColor: colors.surfaceSecondary,
        },
        inputError: {
            borderColor: colors.warning,
        },
        errorText: {
            color: colors.warning,
            fontSize: 12,
            marginTop: 4,
        },
    });
