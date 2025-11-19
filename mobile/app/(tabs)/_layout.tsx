import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />
      <Tabs.Screen
        name="worksheets"
        options={{
          title: 'Folhas de trabalho',
        }}
      />
      <Tabs.Screen
        name="parents"
        options={{
          title: 'Para os pais',
        }}
      />
    </Tabs>
  );
}
