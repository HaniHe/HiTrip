import React from "react";

import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuth } from "../contexts/Auth";
import { Loading } from "../../components/Loading";


export const Router = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }
  return authData ? <AppStack /> : <AuthStack />;
};

