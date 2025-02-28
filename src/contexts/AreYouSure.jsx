import React, { createContext, useContext, useState } from 'react';
import Popup from '@/components/Popup';

const AreYouSureContext = createContext();

export const AreYouSureProvider = ({ children }) => {
    const [AreYouSurePopup, setAreYouSurePopup] = useState({
        open: false,
        actions: () => {}
    });

    return (
        <AreYouSureContext.Provider value={{ AreYouSurePopup, setAreYouSurePopup }}>
            {children}
            {AreYouSurePopup.open && (
                <Popup
                    title={"Are You Sure"}
                    onClose={() => setAreYouSurePopup({
                        ...AreYouSurePopup,
                        open: false
                    })}
                    actions={[
                        { label: "Cancel", onClick: () => {
                            setAreYouSurePopup({
                                ...AreYouSurePopup,
                                open: false
                            })
                        }, type: "secondary" },
                        { label: "Save", onClick: () => { AreYouSurePopup.actions(); setAreYouSurePopup({ open: false, actions: null }) }, type: "primary" },
                    ]}
                >
                    <div className="flex flex-col items-center gap-4">
                        <p className="font-bold text-xl">Are you sure ?</p>
                        <span className="text-gray-600">You can't undo this</span>
                    </div>
                </Popup>
            )}
        </AreYouSureContext.Provider>
    );
};

export const useAreYouSure = () => useContext(AreYouSureContext);