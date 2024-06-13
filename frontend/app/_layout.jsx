import { Stack } from "expo-router";
import { useEffect, useContext } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { UserProvider, UserContext } from "../contexts/userContext.jsx";
import * as SecureStore from "expo-secure-store";
import { ThemeProvider } from "../contexts/themeContext.jsx";

const AppInitializer = () => {
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await SecureStore.getItemAsync("userData");
      if (storedUserData) {
        dispatch({ type: "LOGIN", payload: JSON.parse(storedUserData) });
      }
    };

    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("inset-swipe");
    };

    loadUserData();
    hideNavigationBar();

    const interval = setInterval(() => {
      hideNavigationBar();
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null; // This component does not render anything itself
};

export default function RoutLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppInitializer />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  );
}
