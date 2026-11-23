import { useState } from 'react';
import { colors, globalStyles } from '@/styles/global';
import { addMeal } from '@/storage/meals';
import { router } from 'expo-router';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddMealScreen() {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    const handleAddMeal = async () => {
        if (!name || !calories) {
            if (Platform.OS === 'web') window.alert('Please enter a meal name and calories.');
            else Alert.alert('Error', 'Please enter a meal name and calories.');
            return;
        }

        await addMeal({
            name,
            calories: Number(calories),
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
        });

        setName('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');

        if (Platform.OS === 'web') window.alert('Meal added successfully!');
        else Alert.alert('Success', 'Meal added successfully!');

        router.push('/');
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Add Meal</Text>
            <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>A yummy moment worth tracking ✨</Text>

            <TextInput
                style={styles.input}
                placeholder='Meal name'
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder='Calories'
                placeholderTextColor={colors.textSecondary}
                keyboardType='numeric'
                value={calories}
                onChangeText={setCalories}
            />

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.rowInput]}
                    placeholder='Protein (g)'
                    placeholderTextColor={colors.textSecondary}
                    keyboardType='numeric'
                    value={protein}
                    onChangeText={setProtein}
                />
                <TextInput
                    style={[styles.input, styles.rowInput]}
                    placeholder='Carbs (g)'
                    placeholderTextColor={colors.textSecondary}
                    keyboardType='numeric'
                    value={carbs}
                    onChangeText={setCarbs}
                />
                <TextInput
                    style={[styles.input, styles.rowInput]}
                    placeholder='Fat (g)'
                    placeholderTextColor={colors.textSecondary}
                    keyboardType='numeric'
                    value={fat}
                    onChangeText={setFat}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddMeal}>
                <Text style={styles.buttonText}>Add Meal</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.surface,
        color: colors.text,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 16,
        marginTop: 16,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        gap: 8,
    },

    rowInput: {
        flex: 1,
        minWidth: 0,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 17,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: colors.primary,
        shadowOpacity: 0.24,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});