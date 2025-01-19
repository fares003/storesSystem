import {createContext , useContext , useState } from "react" ; 

const StateContext = createContext() ;


export const ContextProvider = ({children}) => {
    let [screenSize , setScreenSize] = useState(null) ;
    let [activeMenu , setActiveMenu ] = useState(true) ;
    let [activeNotification , setActiveNotification ] = useState(false) ;
    let [newNotification  , setNewNotification] = useState(0);
    return (

        <StateContext.Provider value={{activeMenu , setActiveMenu  ,screenSize , setScreenSize, activeNotification , setActiveNotification ,newNotification  , setNewNotification }}>
            {children}
        </StateContext.Provider>
    )
};

export const useStateContext = ()=> useContext(StateContext) ; 