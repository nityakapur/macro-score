import { DailyHistory, getHistory, rollOverDay } from '@/storage/history';
import { colors, globalStyles } from '@/styles/global';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const formatDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

const rows = [
    { key: 'calories' as const, label: 'Calories', suffix: '' },
    { key: 'protein' as const, label: 'Protein', suffix: 'g' },
    { key: 'carbs' as const, label: 'Carbs', suffix: 'g' },
    { key: 'fat' as const, label: 'Fat', suffix: 'g' },
];

export default function HistoryScreen() {
    const [history, setHistory] = useState<DailyHistory[]>([]);

    useFocusEffect(
        useCallback(() => {
            rollOverDay().then(() => getHistory().then(setHistory));
        }, []),
    );

    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>7-Day History</Text>
            <Text style={styles.subtitle}>Your plan versus what you achieved 🥰</Text>

            {history.length === 0 ? (
                <Text style={globalStyles.empty}>Complete a day to start your little history.</Text>
            ) : (
                history.map((entry) => (
                    <View key={entry.date} style={styles.dayCard}>
                        <Text style={styles.date}>{formatDate(entry.date)}</Text>
                        {rows.map((row) => {
                            const achieved = entry.achieved[row.key];
                            const planned = entry.planned[row.key];
                            const percent = planned > 0 ? Math.round((achieved / planned) * 100) : 0;
                            const progress = Math.min(percent, 100);

                            return (
                                <View key={row.key} style={styles.row}>
                                    <View style={styles.rowHeader}>
                                        <Text style={styles.label}>{row.label}</Text>
                                        <Text style={styles.values}>{achieved}{row.suffix} / {planned}{row.suffix}</Text>
                                    </View>
                                    <View style={styles.track}>
                                        <View style={[styles.fill, { width: `${progress}%` }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        color: colors.textSecondary,
        marginBottom: 20,
    },
    dayCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 12,
    },
    date: {
        color: colors.primaryDark,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
    },
    row: {
        marginBottom: 10,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        color: colors.text,
        fontWeight: '700',
    },
    values: {
        color: colors.textSecondary,
        fontSize: 13,
    },
    track: {
        height: 7,
        borderRadius: 999,
        backgroundColor: colors.surfacePink,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: colors.primary,
    },
});
