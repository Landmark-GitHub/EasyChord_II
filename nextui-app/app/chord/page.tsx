"use client";
import { title } from "@/components/primitives";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useMusic } from '../../contexts/MusicContext';
import { ScrollShadow } from "@nextui-org/react";
import styles from '../../styles/sylespagechord.module.css'; 
import { FaList, FaFileAlt } from "react-icons/fa";

interface MusicData {
    title: string;
    text: { text: string; chords: string; rest_text: string }[];
}

export default function Chord() {
    const keyword = useSearchParams().get("code");
    const { dataMusic, setDataMusic } = useMusic();
    const [loading, setLoading] = useState<boolean>(true);
    const [viewType, setViewType] = useState<boolean>(true);

    useEffect(() => {
    async function getDataMusic() {
        const link = `${process.env.NEXT_PUBLIC_BACKEND}/chordsMusic/${keyword}`
        if (keyword) {
            try {
                const response = await fetch(link);
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
        }else{
            return
        }
    }

    getDataMusic();
    }, [keyword, setDataMusic]);

    if (loading) {
    return <h1 className={title()}>LOADING...</h1>;
    }

    const formatTextWithChords = (text: string, chords: string[] = []) => {
        let i = 0;
        let formattedText = text.replace(/_/g, () => chords[i++]);
    
        const replaceNonChord = (text: string, chordArray: string[]) => {
            return text
                .split('')
                .map(char => (chordArray.some(chord => text.startsWith(chord, text.indexOf(char))) ? char : '\u00A0'))
                .join('');
        };
    
        let chordOnlyText = chords.reduce((acc, chord) => acc.replace(new RegExp(chord, 'g'), ''), formattedText);
        return (
            <>
                <span className={styles.text}>{replaceNonChord(formattedText, chords)}</span>
                <p>{chordOnlyText}</p>
            </>
        );
    };
    

    return (
    <div className="w-screen absolute top-10 left-0 p-6 md:px-40">
        {dataMusic ? (
        <>
            <div className="flex items-center">
                <button 
                    className={`border rounded ${viewType === true ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
                    onClick={() => setViewType(!viewType)}
                    title="Show as List"
                >
                    <FaList size={20} />
                </button>
                <button 
                    className={`border rounded ${viewType === false ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
                    onClick={() => setViewType(!viewType)}
                    title="Show as Page"
                >
                    <FaFileAlt size={20} />
                </button>
            </div>
            {viewType ? (
                <ScrollShadow size={100} className="w-full md:h-[500px] h-[600px] mb-34">
                    <h1 className={styles.title}>{dataMusic[0].title}</h1>
                    <ul>
                        {dataMusic[0].text.map((item, index) => (
                            <li key={index}>
                                {formatTextWithChords(item.text, item.chords)}
                            </li>
                        ))}
                    </ul>
                </ScrollShadow>
            ) : (
                <div className="w-full h-auto p-4">
                    <h1 className={`${styles.title} mb-4`}>{dataMusic[0].title}</h1>
                    <div 
                        className="grid grid-cols-5 grid-rows-5"
                        style={{
                            maxHeight: "calc(100vh - 150px)", 
                            gridAutoColumns: "minmax(0, 1fr)", 
                            overflow: "hidden"
                        }}
                        //  grid-template-columns: auto auto auto;
                        //  grid-auto-flow: column
                    >
                        {dataMusic[0].text.map((item, index) => (
                            <div 
                                key={index} 
                            >
                                {formatTextWithChords(item.text, item.chords)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
        ) : (
        <h1 className={title()}>No data found</h1>
        )}
    </div>
    );
}
