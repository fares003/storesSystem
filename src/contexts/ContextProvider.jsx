import {createContext , useContext , useState } from "react" ; 

const StateContext = createContext() ;


export const ContextProvider = ({children}) => {
    let [screenSize , setScreenSize] = useState(null) ;
    let [activeMenu , setActiveMenu ] = useState(true) ;
    
    return (

        <StateContext.Provider value={{activeMenu , setActiveMenu  ,screenSize , setScreenSize }}>
            {children}
        </StateContext.Provider>
    )
};

export const useStateContext = ()=> useContext(StateContext) ; 