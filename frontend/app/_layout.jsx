// This file is the starting point of the frontend application. It is the first file that is loaded when the application is started. It is responsible for rendering the application layout and routing the application to the correct page based on the URL.
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function RoutLayout() {
  useEffect(() => {
    // Function to hide the navigation bar
    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("inset-swipe");
    };

    // Initially hide the navigation bar
    hideNavigationBar();

    // Set a timer to hide the navigation bar every 2 seconds
    const interval = setInterval(() => {
      hideNavigationBar();
    }, 2000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
