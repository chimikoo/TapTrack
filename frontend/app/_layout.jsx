// This file is the starting point of the frontend application. It is the first file that is loaded when the application is started. It is responsible for rendering the application layout and routing the application to the correct page based on the URL.
import { Stack } from "expo-router";


export default function RoutLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}


