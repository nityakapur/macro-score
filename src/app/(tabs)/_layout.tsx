import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    height: 82,
                    paddingTop: 8,
                    paddingBottom: 12,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='heart' size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='add-meal'
                options={{
                    title: 'Add Meal',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='add-circle' size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='history'
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='calendar-outline' size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='meals'
                options={{
                    title: 'All Meals',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='list' size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
