import { Alert, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { deleteMeal } from '@/storage/meals';
import { colors } from '@/styles/global';
import * as Haptics from 'expo-haptics';

type MealItemProps = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    onDelete: () => void;
};

export default function MealItem({
                                     id,
                                     name,
                                     calories,
                                     protein,
                                     carbs,
                                     fat,
                                     onDelete,
                                 }: MealItemProps) {
    const confirmDelete = async () => {
        await deleteMeal(id);
        onDelete();
    };

    const handlePress = () => {
        if (Platform.OS === 'web') {
            if (window.confirm(`Delete "${name}"?`)) {
                void confirmDelete();
            }
            return;
        }

        Alert.alert('Delete Meal', `Are you sure you want to delete "${name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => void confirmDelete(),
            },
        ]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).then(r => console.log(r));
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={Platform.OS === 'web' ? handlePress : undefined}
            onLongPress={Platform.OS !== 'web' ? handlePress : undefined}
            accessibilityRole='button'
            accessibilityLabel={`Delete ${name}`}
        >
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.macros}>
                {calories} cal • {protein}g P • {carbs}g C • {fat}g F
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    macros: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 4,
    },
});