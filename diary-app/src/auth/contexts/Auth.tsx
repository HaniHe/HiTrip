import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthData, authService } from "../services/authService";

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(formData: any): Promise<void>;
  registerUser(formData: any): Promise<void>;
  signOut(): void;
  updateAuthData(data: AuthData): Promise<void>;
};

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};
//创建一个AuthProvider组件来管理认证状态,并在APP.js(应用的根组件)
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>();

  //the AuthContext start with loading equals true
  //and stay like this, until the data be load from Async Storage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem("@AuthData");
      if (authDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  const signIn = async (formData) => {
    try {
      //call the service passing credential (email and password).
      //In a real App this data will be provided by the user from some InputText components.
      const _authData = await authService.signIn(formData);
      //Set the data in the context, so the App can be notified
      //and send the user to the AuthStack
      setAuthData(_authData);
      await AsyncStorage.setItem("@AuthData", JSON.stringify(_authData));
      return Promise.resolve();
    } catch (error) {
      console.error("Login failed: ", error);
      return Promise.reject(error);
    }
  };

  const registerUser = async (formData) => {
    try {
      const _authData = await authService.registerUser(formData);
      setAuthData(_authData);
      // setUser(_authData);
      await AsyncStorage.setItem("@AuthData", JSON.stringify(_authData));
      return Promise.resolve();
    } catch (error) {
      console.error("Register failed: ", error);
      return Promise.reject(error);
    }
  };

  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(undefined);
    // clearUser();

    //Remove the data from Async Storage
    //to NOT be recoverede in next session.
    await AsyncStorage.removeItem("@AuthData");
  };

  const updateAuthData = async (data: AuthData) => {
    try {
      setAuthData(data);
      await AsyncStorage.setItem("@AuthData", JSON.stringify(data));
      return Promise.resolve();
    } catch (error) {
      console.error("Update auth data failed: ", error);
      return Promise.reject(error);
    }
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AuthContext.Provider
      value={{ authData, loading, signIn, signOut, registerUser, updateAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth };
