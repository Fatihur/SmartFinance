import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';
import { MainTabParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import StatsScreen from '../screens/StatsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'AddTransaction':
              iconName = 'mic';
              break;
            case 'Stats':
              iconName = 'bar-chart';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.cardBorder,
          paddingBottom: 10,
          paddingTop: 10,
          height: 75,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 2,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Beranda',
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          tabBarLabel: 'Mic',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
              borderWidth: 3,
              borderColor: COLORS.surface,
            }}>
              <Icon name="mic" size={28} color={COLORS.surface} />
            </View>
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Statistik',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
