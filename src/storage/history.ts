import AsyncStorage from '@react-native-async-storage/async-storage';
import { MacroGoals, getMacroGoals } from './goals';
import { Meal, getMeals } from './meals';

export type DailyHistory = {
    date: string;
    achieved: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    planned: MacroGoals;
};

const HISTORY_KEY = 'macro-history';
const ACTIVE_DATE_KEY = 'macro-active-date';

export const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getHistory = async (): Promise<DailyHistory[]> => {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
};

const totalsForMeals = (meals: Meal[]) => meals.reduce(
    (totals, meal) => ({
        calories: totals.calories + (Number(meal.calories) || 0),
        protein: totals.protein + (Number(meal.protein) || 0),
        carbs: totals.carbs + (Number(meal.carbs) || 0),
        fat: totals.fat + (Number(meal.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
);

export const rollOverDay = async (): Promise<void> => {
    const today = getLocalDateKey();
    const previousDate = await AsyncStorage.getItem(ACTIVE_DATE_KEY);

    if (!previousDate) {
        await AsyncStorage.setItem(ACTIVE_DATE_KEY, today);
        return;
    }

    if (previousDate === today) return;

    const meals = await getMeals();
    const previousMeals = meals.filter((meal) => {
        if (!meal.createdAt) return false;
        return getLocalDateKey(new Date(meal.createdAt)) === previousDate;
    });

    const planned = await getMacroGoals();
    const achieved = totalsForMeals(previousMeals);
    const history = await getHistory();

    const updatedHistory = [
        ...history.filter((entry) => entry.date !== previousDate),
        { date: previousDate, achieved, planned },
    ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    const remainingMeals = meals.filter((meal) => {
        if (!meal.createdAt) return false;
        return getLocalDateKey(new Date(meal.createdAt)) === today;
    });
    await AsyncStorage.setItem('meals', JSON.stringify(remainingMeals));
    await AsyncStorage.setItem(ACTIVE_DATE_KEY, today);
};
