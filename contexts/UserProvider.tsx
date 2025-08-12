import React, { useState, useEffect, createContext, useContext } from "react";
import kvstore from "expo-sqlite/kv-store";
import { verifyLicense } from "@/utils";

interface UserContextProps {
    isPremiumUser: boolean;
    setIsPremiumUser: (value: boolean) => void;
}

const UserContext = createContext<UserContextProps | null>(null);

async function checkPremium() {
    const license = await kvstore.getItemAsync("premium_license");
    if (!license) return false;
    const result = await verifyLicense(license);
    return result.valid;
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setIsPremiumUser(await checkPremium());
        })();
    }, []);

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
