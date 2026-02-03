import { createContext, useContext } from 'react';

const BackgroundModeContext = createContext<boolean>(false);

export const useBackgroundMode = () => useContext(BackgroundModeContext);

export default BackgroundModeContext;
