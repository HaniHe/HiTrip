import React from "react";
import { Appbar } from "react-native-paper";
import icon_exit from "../../../assets/icon/icon_exit.png";
import { useAuth } from "../../../auth/contexts/Auth";

export const UserTitle = () => {
  const auth = useAuth();
  const logout = () => {
    auth.signOut();
  };
  return (
    <Appbar.Header style={{ backgroundColor: "transparent" }}>
      <Appbar.Content />
      <Appbar.Action icon={icon_exit} onPress={logout} />
    </Appbar.Header>
  );
};
