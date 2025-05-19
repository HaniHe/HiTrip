import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Router } from "./src/auth/routes/Router";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/auth/contexts/Auth";

export default function App() {

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <Router />
            <Toast />
          </NavigationContainer>
          <StatusBar />
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}


