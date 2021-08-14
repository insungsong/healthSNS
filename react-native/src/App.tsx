import React, {useEffect, useCallback} from 'react';
import {StatusBar, AppState} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {ApolloProvider, fromPromise} from '@apollo/react-hooks';
import theme from './lib/theme';
import apolloClient from './lib/apolloClient';
import {NavigationContainer} from '@react-navigation/native';
import SplashNavigator from './navigators/SplashNavigator';
import 'moment/locale/ko';
import moment from 'moment';
import useMainScreenContext, {
  MainScreenContextProvider,
} from './components/Common/hooks/useMainScreen.context';
import {navigationRef} from './RootNavigation';
import SplashScreen from 'react-native-splash-screen';

moment.locale('ko');

if (!__DEV__) {
  console.log = () => {};
}
// if (__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(true);
// }

const MyApp = (props) => {
  const {fontSize} = useMainScreenContext();

  setTimeout(() => {
    SplashScreen.hide();
  }, 3000);

  return (
    <ThemeProvider theme={{...theme, fontSize}}>
      {/* {console.log('MyApp theme ==== ', theme)} */}
      <SplashNavigator />
    </ThemeProvider>
  );
};

const App = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer ref={navigationRef}>
        <MainScreenContextProvider>
          <MyApp />
        </MainScreenContextProvider>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
