"use client"; // This line ensures the component is treated as a Client Component
import React, { useRef, useState, useEffect }  from "react";
import { Card, CardBody, Image, Button, Slider, ScrollShadow, VisuallyHidden, useSwitch, CardFooter } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

import { motion } from "framer-motion";
import { useMusic } from "../contexts/MusicContext";
import { FaRegHeart } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";

import { tableChords } from '../config/tableChord';

interface OptionChordProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    nameChord: string;
    positionChord: number | undefined;
    chordImages: string[];
    setChordImages?: (images: string[]) => void; 
}

const OptionChord: React.FC<OptionChordProps> = ({ isOpen, onOpenChange, nameChord, positionChord, chordImages, setChordImages}) => {
    let dataImage: string[] = [];

    if (isOpen && nameChord) {
        dataImage = tableChords[nameChord] || [];
    }

    function setupChordImage(item: string) {
        // Assuming you want to update the chordImages object with the selected chord image

        if (setChordImages && positionChord !== undefined) {
            // Create a copy of chordImages
            const updatedChordImages = [...chordImages];
            
            // Update the item at positionChord
            updatedChordImages[positionChord] = item;
            
            // Set the new chordImages
            setChordImages(updatedChordImages);
        }
        //onOpenChange(false)
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"}>
            <ModalContent>
                <ModalHeader>{nameChord}</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-3 grid-flow-rows gap-4">
                        {dataImage.length > 0 ? (
                            dataImage.map((item, index) => (
                                <Card shadow="sm" key={index} isPressable onPress={() => setupChordImage(item)}>
                                    <CardBody className="overflow-visible p-0">
                                        <Image
                                            shadow="sm"
                                            radius="lg"
                                            width="100%"
                                            alt={`Chord image for ${nameChord} - ${index}`}
                                            className="w-full object-cover h-[140px] p-1"
                                            src={item}
                                        />
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <p>No images available for this chord.</p>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const Footer = (props:any) => {

    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword");
    const id = searchParams.get("code");
    const { dataMusic, setDataMusic } = useMusic();
    const counterKeyRef = useRef(0);
    const optionChord = useDisclosure();
    const [chordImages, setChordImages] = useState<string[]>([]);
    const [nameChord, setNameChord] = useState('');
    const [positionChord, setPositionChord] = useState<number | undefined>(undefined);
    const hasRun = useRef(false);

    type KeyAction = 'addkey' | 'reducekey';

    //dataMusic[0].chord
    //at same dataMusic[0].chord == dataChord
    const dataChord = [
        {
            chord: ['B', 'Amaj7', 'C','C','C', 'Fmaj7', 'D', 'Dmaj7', 'E', 'Emaj7', 'F', 'G', 'Cmaj7', 'G', 'B']
        }
    ];

    useEffect(() => {
        if (!hasRun.current && dataChord[0]?.chord) {
            hasRun.current = true; // Set the ref to true so the effect won't run again
    
            const newChordImages = dataChord[0].chord.reduce<string[]>((images, chord) => {
                if (tableChords[chord]) {
                    images.push(tableChords[chord][0]);
                }
                return images;
            }, []);
    
            console.log(newChordImages);
    
            setChordImages(newChordImages);
        }
    }, [dataChord, tableChords]);

    async function change_key(action:KeyAction) {
        try {
            setDataMusic(prevData => prevData ? [{...prevData[0], title: null}, ...prevData.slice(1)] : []);
            const newKey = action === 'addkey' ? counterKeyRef.current + 1 : counterKeyRef.current - 1;
            const counter = newKey
            // console.log(`http://127.0.0.1:8000/chordsMusic/${id}/${counter}`)
            const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${id}/${counter}`);
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

    function change_chord(name:string,position: number) {
        setNameChord(name)
        setPositionChord(position)
        optionChord.onOpenChange(true);
    }

    const {
        Component, 
        slots, 
        isSelected, 
        getBaseProps, 
        getInputProps, 
        getWrapperProps
    } = useSwitch(props);

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
                    
                    {dataChord ? 
                        <div className=" absolute right-2 top-2 flex justify-between items-start z-20">
                            <div className="grid grid-flow-col gap-2">
                                <Component {...getBaseProps()}>
                                    <VisuallyHidden>
                                    <input {...getInputProps()} />
                                    </VisuallyHidden>
                                    <div
                                    {...getWrapperProps()}
                                    className={slots.wrapper({
                                        class: [
                                        "w-8 h-8",
                                        "flex items-center justify-center",
                                        "rounded-lg bg-default-100 hover:bg-default-200",
                                        ],
                                    })}
                                    >
                                    </div>
                                </Component>
                                <Button
                                isIconOnly
                                size="sm" 
                                aria-label="Like Music"
                                >
                                    <FaRegHeart />
                                </Button>
                            </div>
                        </div>
                    :
                        <></>
                    }      

                    {isSelected && dataChord ?
                        <div className="">
                        <ScrollShadow orientation="horizontal" className="max-w-full overflow-x-auto">
                            <div className="flex space-x-4 w-max">
                                {chordImages.map((src, index) => (
                                    <Card shadow="sm" key={index} isPressable onClick={() => change_chord(dataChord[0].chord[index],index)}>
                                        <CardBody className="overflow-visible p-0">
                                            <Image
                                                shadow="sm"
                                                radius="lg"
                                                width="100%"
                                                alt={`Chord image for ${dataChord[0].chord[index]}`}
                                                className="w-full object-cover h-[140px]"
                                                src={src}
                                            />
                                        </CardBody>
                                        <CardFooter className="text-small">
                                            <b>{dataChord[0].chord[index]}</b>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </ScrollShadow>
                    </div>
                    :
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

                                <div className="flex flex-col gap-0">
                                    <h1 className="text-large font-medium">
                                        {dataMusic ? `${dataMusic[0].title} : ${dataMusic[0].capo}` : "Frontend Radio"}
                                    </h1>
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
                    } 


                </CardBody>
            </Card>

            <OptionChord 
                isOpen={optionChord.isOpen} 
                onOpenChange={optionChord.onOpenChange} 
                nameChord={nameChord}
                positionChord={positionChord}
                chordImages={chordImages}
                setChordImages={setChordImages}>
            </OptionChord>

        </motion.div>
    )

};


export default Footer;

