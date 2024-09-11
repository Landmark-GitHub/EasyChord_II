// src/contexts/MusicContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MusicContextType {
  dataMusic: any; // ปรับประเภทของข้อมูลตามที่คุณมี
  setDataMusic: React.Dispatch<React.SetStateAction<any>>; // ปรับประเภทตามข้อมูลของคุณ
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = (): MusicContextType => {
    const context = useContext(MusicContext);
    if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
    };

    interface MusicProviderProps {
    children: ReactNode;
    }

    export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
    const [dataMusic, setDataMusic] = useState<any>(null); // ปรับประเภทตามข้อมูลของคุณ

    return (
    <MusicContext.Provider value={{ dataMusic, setDataMusic }}>
        {children}
    </MusicContext.Provider>
    );
};
