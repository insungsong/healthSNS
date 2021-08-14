import React, {useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export enum MAIN_SCREEN {
  LOADING,
  USER_LOGIN,
  USER_TERMS,
  USER_LOCK_SCREEN,
  TAB_NAVIGATOR,
}

interface IMainScreenContext {
  mainScreen: MAIN_SCREEN;
  setMainScreen: Function;
  fontSize: number;
  setFontSize: Function;
}

const MainScreenContext = React.createContext<MAIN_SCREEN>(MAIN_SCREEN.LOADING);

export function MainScreenContextProvider(props) {
  const [mainScreen, setMainScreen] = useState(MAIN_SCREEN.LOADING);
  const [fontSize, _setFontSize] = useState(16); //처음에 16초기값, 두번째은...?
  // const [fontSize, setFontSize] = useState(16);

  //3.
  const setFontSize = async (value) => {
    console.log('2. setFontSize value=> ', value);
    await AsyncStorage.setItem('textSize', JSON.stringify(value));
    _setFontSize(value);
  };

  const value: IMainScreenContext = {
    mainScreen,
    setMainScreen,
    fontSize,
    setFontSize,
  };
  //2.
  useEffect(() => {
    AsyncStorage.getItem('textSize', (err, value) => {
      console.log('1. value in getItem', value);
      setFontSize(JSON.parse(value) || 16);
      console.log('3. fontSize', fontSize);
    });
  }, []);

  return <MainScreenContext.Provider value={value} {...props} />;
}

export default function useMainScreenContext() {
  const context = useContext<MAIN_SCREEN>(MainScreenContext);
  if (!context) {
    throw new Error('useMainScreenContext is undefined.');
  }
  return context;
}
