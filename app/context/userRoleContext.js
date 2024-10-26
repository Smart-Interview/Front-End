'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole && ['ceo', 'rh', 'candidate'].includes(storedRole)) {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <UserRoleContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = () => useContext(UserRoleContext);
