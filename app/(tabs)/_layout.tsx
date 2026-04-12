import { AnimatedTabButton } from '@/src/components/tab-bar/animated-tab-button';
import { appTheme } from '@/src/constants/app-theme';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark as BookmarkBold, Home as HomeBold, Magnifer as MagniferBold, Settings as SettingsBold } from "react-native-solar-icons/icons/bold-duotone";
import { Bookmark as BookmarkLine, Home as HomeLine, Magnifer as MagniferLine, Settings as SettingsLine } from "react-native-solar-icons/icons/outline";
import { useUniwind } from 'uniwind';

const TAB_BAR_HEIGHT = 70;

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useUniwind();


  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme === 'light' ? appTheme.colors.light.primary : appTheme.colors.dark.primary,
      tabBarActiveBackgroundColor: theme === 'light' ? appTheme.colors.light.primaryLight : appTheme.colors.dark.primaryLight,
      tabBarStyle: {
        backgroundColor: theme === 'light' ? appTheme.colors.light.surface : appTheme.colors.dark.surface,
        height: TAB_BAR_HEIGHT + bottom,
        paddingTop: 5,
        paddingBottom: bottom + 5,
        paddingHorizontal: 5,
        borderTopWidth: 0,
        borderTopColor: theme === 'light' ? appTheme.colors.light.primary : appTheme.colors.dark.primary,
        elevation: 0,
      },
      tabBarLabelStyle: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 9,
        textTransform: 'uppercase',
      },
      tabBarItemStyle: {
        borderRadius: 100,
        overflow: 'hidden',
        margin: 5,
      },
      tabBarButton: ({ children, style, onPress, onLongPress, accessibilityState }) => (
        <AnimatedTabButton
          focused={accessibilityState?.selected ?? false}
          style={style}
          onPress={onPress}
          onLongPress={onLongPress}
        >
          {children}
        </AnimatedTabButton>
      ),
      headerTitleStyle: { fontFamily: 'Montserrat_600SemiBold' },
      headerTintColor: theme === 'light' ? appTheme.colors.light.text : appTheme.colors.dark.text,
      headerStyle: { backgroundColor: theme === 'light' ? appTheme.colors.light.surface : appTheme.colors.dark.surface },
      headerShadowVisible: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => focused
            ? <HomeBold size={size} color={color} />
            : <HomeLine size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => focused
            ? <MagniferBold size={size} color={color} />
            : <MagniferLine size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, size, focused }) => focused
            ? <BookmarkBold size={size} color={color} />
            : <BookmarkLine size={size} color={color} />,
          // headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => focused
            ? <SettingsBold size={size} color={color} />
            : <SettingsLine size={size} color={color} />,
          // headerShown: false,
        }}
      />
    </Tabs>
  );
}