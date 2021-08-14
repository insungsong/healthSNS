import React, {useEffect, useState} from 'react';
import TabNavigator from '../navigators/TabNavigator';
import useMainScreenContext, {
  MAIN_SCREEN,
} from '../components/Common/hooks/useMainScreen.context';
import Spinner from 'react-native-loading-spinner-overlay';
const MainScreen = () => {
  const {mainScreen, setMainScreen} = useMainScreenContext();

  const [loaded, setLoaded] = useState();

  useEffect(() => {
    setMainScreen(MAIN_SCREEN.TAB_NAVIGATOR);
  }, [loaded]);

  if (mainScreen === MAIN_SCREEN.LOADING) {
    console.log('mainScreen === MAIN_SCREEN.LOADING');
    return <Spinner visible={true} />;
  } else if (mainScreen === MAIN_SCREEN.TAB_NAVIGATOR) {
    console.log('mainScreen === MAIN_SCREEN.TAB_NAVIGATOR');
    return (
      <>
        <TabNavigator />
      </>
    );
  }
};

export default MainScreen;
