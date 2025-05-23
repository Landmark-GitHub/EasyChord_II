"use client"; // This line ensures the component is treated as a Client Component
import React, { useRef }  from "react";
import { Card, CardBody, Image, Button, Slider, ButtonGroup, Switch } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

import { motion } from "framer-motion";
import { useMusic } from "../contexts/MusicContext";
import { FaRegHeart } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";

const Footer = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword");
    const id = searchParams.get("code");
    const { dataMusic, setDataMusic } = useMusic();
    const counterKeyRef = useRef(0);

    type KeyAction = 'addkey' | 'reducekey';
    async function change_key(action:KeyAction) {
        try {
            setDataMusic(prevData => prevData ? [{...prevData[0], title: null}, ...prevData.slice(1)] : []);
            const newKey = action === 'addkey' ? counterKeyRef.current + 1 : counterKeyRef.current - 1;
            const counter = Math.abs(newKey);
            console.log(`http://127.0.0.1:8000/chordsMusic/${id}/${action}/${counter}`)
            const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${id}/${action}/${counter}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data: MusicData[] = await response.json();
            setDataMusic(data);
            counterKeyRef.current = newKey; // อัพเดต counterKeyRef
        } catch (error) {
            console.error('Error adjusting key:', error);
        }
    }

    return (
        <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 ,delay: 1 ,ease: "linear",
        duration: 2,
        x: { duration: 1 }}}
        className="border-none bg-background/60 dark:bg-default-100/50 w-full shadow-sm ">

        <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 w-full"
            shadow="sm"
        >
            <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-4 items-center justify-center">

                <div className="relative col-span-6 md:col-auto">
                <Image
                    alt="Album cover"
                    className="hidden md:block object-cover"
                    height={200}
                    shadow="md"
                    src= "https://www.dochord.com/wp-content/uploads/2017/10/MAIYARAP-150x150.jpg"
                    width={190}
                />
                </div>

                <div className="flex flex-col col-span-6 md:col-span-11">

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0">
                            <h1 className="text-large font-medium">
                                {dataMusic ? `${dataMusic[0].title} : ${dataMusic[0].capo}` : "Frontend Radio"}
                            </h1>
                        </div>
                        <div className="grid grid-flow-col gap-2">
                            <Switch defaultSelected size="sm" color="default">Dochord</Switch>
                            <Button
                            isIconOnly
                            size="sm" 
                            aria-label="Like Music"
                            >
                                <FaRegHeart />
                            </Button>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-1">
                        <Slider
                        aria-label="Music progress"
                        classNames={{
                            track: "bg-default-500/30",
                            thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                        }}
                        color="foreground"
                        defaultValue={0}
                        size="sm"
                        />
                        <div className="flex justify-between">
                        <p className="text-small">0:00</p>
                        <p className="text-small text-foreground/50">4:32</p>
                        </div>
                    </div>

                    {/* <div className="flex w-full items-center justify-between"> */}
                    {dataMusic ? 
                    <div className="flex w-full items-center justify-between">
                        <div className="grid grid-flow-col gap-2"> 
                            <p className="flex w-full items-center justify-center"> {dataMusic[0].key} </p>
                            <div className="grid grid-cols-3 gap-0 w-1/8 ">
                                <Button 
                                    isIconOnly 
                                    radius="sm"
                                    size="sm"
                                    onClick={() => change_key('reducekey')}
                                >
                                    -
                                </Button>   
                                <h1 id="counter-display" className="flex justify-center items-center text-center font-bold"> {counterKeyRef.current} </h1>                    
                                <Button 
                                    isIconOnly 
                                    radius="sm"
                                    size="sm"
                                    onClick={() => change_key('addkey')}
                                >
                                    +
                                </Button> 
                            </div>
                        </div>
                        {/* <div>
                            <ButtonGroup>
                                <Button>Console</Button>
                                <Button>Dochord</Button>
                            </ButtonGroup>
                        </div> */}
                        <div className="grid grid-flow-col gap-2">
                            <Button isIconOnly size="sm" aria-label="Take a photo">
                                <FaPlay/>
                            </Button>
                        </div>
                    </div>
                    : 
                        <></>
                    }
                </div>

            </div>
            </CardBody>
        </Card>
        </motion.div>
    );
};
};

export default Footer;

// const incrementCounter = async () => {
//     counterKeyRef.current += 1;
//     let action = "addkey";
//         if  (counterKeyRef.current < 1) {
//             try {
//                 const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${id}/${action}/${counterKeyRef.current}`);
//                 if (!response.ok) {
//                 throw new Error('Failed to fetch data');
//                 }
                
//                 const data: MusicData[] = await response.json();
//                 setDataMusic(data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//     };
// }

// const decrementCounter = async () => {
//     counterKeyRef.current -= 1;
//     let action = "reducekey";
//     if (counterKeyRef.current < 1) {
//         let count = counterKeyRef.current * -1;
//         const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${id}/${action}/${count}`);
//         if (!response.ok) {
//         throw new Error('Failed to fetch data');
//         }
        
//         const data: MusicData[] = await response.json();
//         setDataMusic(data);
//     }else{
        
//     }
//     // try {
//     //     const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${id}/${action}/${count}`);
//     //     if (!response.ok) {
//     //     throw new Error('Failed to fetch data');
//     //     }
        
//     //     const data: MusicData[] = await response.json();
//     //     setDataMusic(data);
//     // } catch (error) {
//     //     console.error('Error fetching data:', error);
//     // }
// };
