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

export default function Chord() {
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

    const formatTextWithChords = (text: string, chords: string[] = []) => {
        let i = 0;
        let text1 = text.replace(/_/g, () => chords[i++]);
        function replaceNonChord(text: string, chordArray: string[]) {
            let result = '';
            let j = 0;
            while (j < text.length) {
                let matched = false;
                for (let k = 0; k < chordArray.length; k++) {
                    if (text.substr(j, chordArray[k].length) === chordArray[k]) {
                        result += chordArray[k];
                        j += chordArray[k].length; // ข้ามจำนวนตำแหน่งเท่ากับคอร์ด
                        matched = true;
                        break;
                    }
                }
                // ถ้าไม่เจอคอร์ดที่ตรงกัน เปลี่ยนเป็นช่องว่าง
                if (!matched) {
                    result += '\u00A0';
                    j++;
                }
            }
            return result;
        }
        let text2 = replaceNonChord(text1, chords);
        let text3 = chords.reduce((acc, chord) => acc.replace(new RegExp(chord, 'g'), ''), text1);
        return (
            <div className="grid grid-rows-2">
                <span className={styles.text}>{text2}</span>
                <p>{text3}</p>
            </div>
        );
    };

    return (
    <div className="w-screen absolute top-20 left-0 p-8 md:px-40">
        {dataMusic ? (
        <ScrollShadow size={100} className="w-full md:h-[500px] h-[600px] mb-34">
            <h1 className={title()}>{dataMusic[0].title}</h1>
            <ul>
                {dataMusic[0].text.map((item, index) => (
                    <li key={index}>
                        {formatTextWithChords(item.text, item.chords)}
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
