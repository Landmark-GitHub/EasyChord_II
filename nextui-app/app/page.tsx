"use client";
import { useSearchParams } from 'next/navigation';
import { Card, CardFooter, } from "@nextui-org/react";
import Image from 'next/image';
import { title } from "@/components/primitives";
import { Pagination } from "@nextui-org/react";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Song {
  title: string;
  image: string;
  code: string;
  url:string;
}

interface CardItemProps {
  code: string;
  image: string;
  title: string;
  url:string;
}

interface CardAreaProps {
  songData: Song[];
}

const CardItem: React.FC<CardItemProps> = ({ code, image, title }) => {
  const router = useRouter();

  function selectMusic(code: string) {
    router.push(`/chord/?code=${code}`);
  }

  return (
    <div onClick={() => selectMusic(code)}>
      <Card radius="lg" className="border-none">
        <Image
          alt="Woman listening to music"
          className="object-contain transition duration-300 ease-in-out hover:blur-sm hover:text-black"
          height={200}
          src={image}
          width={200}
        />
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-white/80">{title}</p>
          <div className="text-tiny text-white bg-black/20 px-3 py-1 rounded-lg">
            Key Original C hi
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const CardArea: React.FC<CardAreaProps> = ({ songData }) => {
  const itemsPerPage = 4; // Number of items to display per page
  const totalItems = songData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const songsToShow = songData.slice(startIndex, endIndex);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          ease: "linear",
          x: { duration: 1 },
        }}
      >
        {songsToShow.map((song, index) => (
          <CardItem
            key={index}
            title={song.title}
            image={song.image}
            code={song.code}
            url={song.url}
          />
        ))}
      </motion.div>
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={(page) => handleChangePage(page)}
      />
      <span className="text-default-600">Original Websit by</span>
      <p className="text-primary">Dochrod.com</p>
    </motion.div>
  );
};

export default function Home() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [listMusic, setListMusic] = useState<Song[]>([]);

  async function getListMusic() {
    const link = `${process.env.NEXT_PUBLIC_BACKEND}/listMusic`
    try{
      const res = await fetch(link);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setListMusic(data.music_list || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setListMusic([]);
    }
    // Fetch data from the FastAPI endpoint
    // await fetch('http://127.0.0.1:8000/listMusic')
    // const link = `${process.env.NEXT_PUBLIC_BACKEND}/listMusic`
    // await fetch(link)
    // .then(response => response.json())
    // .then(data => {
    //   // Set the fetched data to the state
    //   setListMusic(data.music_list);
    // })
    // .catch(error => console.error('Error fetching data:', error));
  }

  async function searchMusic(keyword: string){
    const link = `${process.env.NEXT_PUBLIC_BACKEND}/searchMusic/${keyword}`
    setListMusic([]);
    console.log(link)
    try{
      const res = await fetch(link);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setListMusic(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setListMusic([]);
    }
    // Fetch data from the FastAPI endpoint
    // setListMusic()
    // await fetch(link)
    // .then(response => response.json())
    // .then(data => {
    //   // Set the fetched data to the state
    //   console.log(data)
    //   setListMusic(data);
    // })
    // .catch(error => console.error('Error fetching data:', error));
  }

  useEffect(() => {

    if (!keyword) {
      getListMusic();
    } else {
      searchMusic(keyword);
    }

  }, [keyword]);

  return (
    <div suppressHydrationWarning className="flex flex-col items-center justify-center gap-4 my-20">
      {keyword && <h1 className={title({ color: "violet" })}>{keyword}</h1>}
      <div className='pb-36 lg:pb-0 flex items-center justify-center'>
        {listMusic ? <CardArea songData={listMusic} /> : <h1>loading...</h1>}
      </div>
    </div>
  );
}
