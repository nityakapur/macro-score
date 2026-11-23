import AsyncStorage from '@react-native-async-storage/async-storage';

export type MacroGoals = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

export const defaultGoals: MacroGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
};

const GOALS_KEY = 'macro-goals';

export const getMacroGoals = async (): Promise<MacroGoals> => {
    const data = await AsyncStorage.getItem(GOALS_KEY);
    return data ? { ...defaultGoals, ...JSON.parse(data) } : defaultGoals;
};

export const saveMacroGoals = async (goals: MacroGoals): Promise<void> => {
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};
