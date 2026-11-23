import { StyleSheet } from 'react-native';

export const colors = {
    background: '#FFF8FB',
    header: '#FFF1F6',
    surface: '#FFFFFF',
    surfacePink: '#FFEAF2',
    primary: '#D96C9A',
    primaryDark: '#B94F7B',
    text: '#4A3040',
    textSecondary: '#A18493',
    border: '#F2D9E4',
    lavender: '#B09AD6',
    peach: '#F2B5A3',
    mint: '#91C4AF',
    alert: '#C95F72',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 64,
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.8,
        color: colors.primaryDark,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
        marginTop: 30,
        marginBottom: 14,
    },
    empty: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 28,
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});