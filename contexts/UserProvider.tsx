import React, { useState, useEffect, createContext, useContext } from "react";
import kvstore from "expo-sqlite/kv-store";

interface UserContextProps {
    isPremiumUser: boolean;
    setIsPremiumUser: (value: boolean) => void;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setIsPremiumUser((await kvstore.getItem("isPremiumUser")) === "1");
        })()
    }, []);

    useEffect(() => {
        kvstore.setItem("isPremiumUser", isPremiumUser ? "1" : "0");
    }, [isPremiumUser]);

    return (
        <UserContext.Provider
            value={{
                isPremiumUser,
                setIsPremiumUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
