import {
  AppShell,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";

import { getBaseTheme } from "./style/StyleProvider";
import Main from "./components/Main";
import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { Notifications } from "@mantine/notifications";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import Header from "./components/Header";
import { useSetting } from "./logic/Settings";
import WelcomeView from "./components/WelcomeView";

export default function App() {
  const theme = useMantineTheme();
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  const systemColorScheme = useColorScheme();
  const [sidebarOpened, setSidebarOpened] = useState<boolean>(true);

  const [registered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

  return (
    <ColorSchemeProvider
      colorScheme={
        colorSchemePreference === "system"
          ? systemColorScheme
          : colorSchemePreference
      }
      //not working use setSetting("colorSchemePreference", ...)
      toggleColorScheme={() => {}}
    >
      <MantineProvider
        theme={getBaseTheme(
          theme,
          colorSchemePreference === "system"
            ? systemColorScheme
            : colorSchemePreference
        )}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        {registered ? (
          <AppShell
            navbarOffsetBreakpoint="sm"
            navbar={
              sidebarOpened ? (
                <Sidebar opened={sidebarOpened} setOpened={setSidebarOpened} />
              ) : (
                <></>
              )
            }
          >
            <Main />
          </AppShell>
        ) : (
          <WelcomeView />
        )}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
