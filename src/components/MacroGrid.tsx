import { StyleSheet, View } from 'react-native';
import { Meal } from '@/storage/meals';
import { MacroGoals } from '@/storage/goals';
import MacroCard from './MacroCard';

type MacroGridProps = {
    meals: Meal[];
    goals: MacroGoals;
};

export default function MacroGrid({ meals, goals }: MacroGridProps) {
    const totals = meals.reduce(
        (acc, meal) => ({
            calories: acc.calories + (Number(meal.calories) || 0),
            protein: acc.protein + (Number(meal.protein) || 0),
            carbs: acc.carbs + (Number(meal.carbs) || 0),
            fat: acc.fat + (Number(meal.fat) || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    return (
        <View style={styles.grid}>
            <MacroCard
                label='Calories'
                value={`${totals.calories}`}
                goal={goals.calories.toLocaleString()}
                color='#F2B5A3'
            />
            <MacroCard
                label='Protein'
                value={`${totals.protein}g`}
                goal={`${goals.protein}g`}
                color='#D96C9A'
            />
            <MacroCard
                label='Carbs'
                value={`${totals.carbs}g`}
                goal={`${goals.carbs}g`}
                color='#B09AD6'
            />
            <MacroCard
                label='Fat'
                value={`${totals.fat}g`}
                goal={`${goals.fat}g`}
                color='#91C4AF'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
});