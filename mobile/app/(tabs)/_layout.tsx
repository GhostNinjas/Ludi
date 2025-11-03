import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏠</span>,
        }}
      />
      <Tabs.Screen
        name="worksheets"
        options={{
          title: 'Folhas de trabalho',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📝</span>,
        }}
      />
      <Tabs.Screen
        name="parents"
        options={{
          title: 'Para os pais',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>👨‍👩‍👧</span>,
        }}
      />
    </Tabs>
  );
}
