"use client";
import { title } from "@/components/primitives";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useMusic } from '../../contexts/MusicContext';
import { ScrollShadow } from "@nextui-org/react";
import styles from '../../styles/sylespagechord.module.css'; 

interface MusicData {
    title: string;
    text: { text: string; chords: string; rest_text: string }[];
}

export default function BlogPage() {
    const keyword = useSearchParams().get("code");
    const { dataMusic, setDataMusic } = useMusic();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    async function getDataMusic() {
        if (!keyword) return; // Exit early if no keyword

        try {
        console.log('Loading detail music...')
        const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${keyword}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data: MusicData[] = await response.json();
        setDataMusic(data);
        setLoading(false);
        } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        }
    }

    getDataMusic();
    }, [keyword, setDataMusic]);

    if (loading) {
    return <h1 className={title()}>LOADING...</h1>;
    }

    return (
    <div className="w-screen absolute top-20 left-0 p-8 md:px-40">
        {dataMusic ? (
        <ScrollShadow size={100} className="w-full md:h-[500px] h-[600px] mb-34">
            <h1 className={title()}>{dataMusic[0].title}</h1>
            <ul>
            {dataMusic[0].text.map((item, index) => (
                <li className={`${styles.text}`} key={index}>
                {item.text}<span className={`${styles.chord}`}>{item.chords}</span>{item.rest_text}
                </li>
            ))}
            </ul>
        </ScrollShadow>
        ) : (
        <h1 className={title()}>No data found</h1>
        )}
    </div>
    );
}
