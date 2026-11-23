import HomeHeader from '@/components/HomeHeader';
import MacroGrid from '@/components/MacroGrid';
import RecentMeals from '@/components/RecentMeals';
import { getMeals, Meal } from '@/storage/meals';
import { defaultGoals, getMacroGoals, MacroGoals, saveMacroGoals } from '@/storage/goals';
import { colors, globalStyles } from '@/styles/global';
import { useFocusEffect } from 'expo-router';
import { rollOverDay } from '@/storage/history';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [goals, setGoals] = useState<MacroGoals>(defaultGoals);
    const [goalModalVisible, setGoalModalVisible] = useState(false);
    const [goalInputs, setGoalInputs] = useState({
        calories: `${defaultGoals.calories}`,
        protein: `${defaultGoals.protein}`,
        carbs: `${defaultGoals.carbs}`,
        fat: `${defaultGoals.fat}`,
    });

    const loadMeals = async () => {
        const data = await getMeals();
        setMeals(data);
    };

    const loadGoals = async () => {
        const data = await getMacroGoals();
        setGoals(data);
    };

    useFocusEffect(
        useCallback(() => {
            rollOverDay().then(() => {
                loadMeals();
                loadGoals();
            });
        }, []),
    );

    useEffect(() => {
        const timer = setInterval(() => {
            rollOverDay().then(loadMeals);
        }, 60_000);
        return () => clearInterval(timer);
    }, []);

    const openGoalModal = () => {
        setGoalInputs({
            calories: `${goals.calories}`,
            protein: `${goals.protein}`,
            carbs: `${goals.carbs}`,
            fat: `${goals.fat}`,
        });
        setGoalModalVisible(true);
    };

    const saveGoals = async () => {
        const nextGoals: MacroGoals = {
            calories: Number(goalInputs.calories),
            protein: Number(goalInputs.protein),
            carbs: Number(goalInputs.carbs),
            fat: Number(goalInputs.fat),
        };

        if (Object.values(nextGoals).some((value) => !Number.isFinite(value) || value <= 0)) {
            const message = 'Please enter a positive number for every target.';
            if (Platform.OS === 'web') window.alert(message);
            else Alert.alert('Check your targets', message);
            return;
        }

        await saveMacroGoals(nextGoals);
        setGoals(nextGoals);
        setGoalModalVisible(false);
    };

    return (
        <ScrollView style={globalStyles.container}>
            <View style={styles.titleRow}>
                <Text style={globalStyles.title}>MacroMuse ✨</Text>
                <TouchableOpacity style={styles.goalButton} onPress={openGoalModal} activeOpacity={0.8}>
                    <Text style={styles.goalButtonText}>Targets 🎀</Text>
                </TouchableOpacity>
            </View>
            <HomeHeader />
            <MacroGrid meals={meals} goals={goals} />
            <RecentMeals meals={meals} onDelete={loadMeals} />

            <Modal
                visible={goalModalVisible}
                transparent
                animationType='fade'
                onRequestClose={() => setGoalModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Set your targets 🎀</Text>
                        <Text style={styles.modalSubtitle}>Make your daily goals feel just right for you.</Text>

                        {([
                            ['calories', 'Calories'],
                            ['protein', 'Protein (g)'],
                            ['carbs', 'Carbs (g)'],
                            ['fat', 'Fat (g)'],
                        ] as const).map(([key, label]) => (
                            <View key={key} style={styles.inputRow}>
                                <Text style={styles.inputLabel}>{label}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={goalInputs[key]}
                                    onChangeText={(value) => setGoalInputs((current) => ({ ...current, [key]: value }))}
                                    keyboardType='numeric'
                                    placeholder='0'
                                    placeholderTextColor={colors.textSecondary}
                                    selectTextOnFocus
                                />
                            </View>
                        ))}

                        <TouchableOpacity style={styles.saveButton} onPress={saveGoals} activeOpacity={0.85}>
                            <Text style={styles.saveButtonText}>Save my targets 💗</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setGoalModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Maybe later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    goalButton: {
        backgroundColor: colors.surfacePink,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginBottom: 4,
    },
    goalButtonText: {
        color: colors.primaryDark,
        fontSize: 13,
        fontWeight: '800',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(74, 48, 64, 0.35)',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: colors.background,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 20,
        shadowColor: '#8D4D68',
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.primaryDark,
    },
    modalSubtitle: {
        marginTop: 6,
        marginBottom: 16,
        color: colors.textSecondary,
        fontSize: 14,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    inputLabel: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '700',
    },
    input: {
        width: 110,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        color: colors.text,
        paddingHorizontal: 14,
        paddingVertical: 10,
        textAlign: 'right',
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 15,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 12,
        paddingVertical: 8,
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontWeight: '700',
    },
});