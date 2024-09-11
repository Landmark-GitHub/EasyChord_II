"use client";
import { useSearchParams } from 'next/navigation';
import { Card, CardFooter, Image } from "@nextui-org/react";
import { title } from "@/components/primitives";
import { Pagination } from "@nextui-org/react";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Song {
  title: string;
  image: string;
  code: string;
}

interface CardItemProps {
  code: string;
  image: string;
  title: string;
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
            Key Original C
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
          duration: 2,
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
    </motion.div>
  );
};

export default function Home() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [listMusic ,setListMusic] = useState()

  async function getListMusic() {
    // Fetch data from the FastAPI endpoint
    await fetch('http://127.0.0.1:8000/listMusic')
    .then(response => response.json())
    .then(data => {
      // Set the fetched data to the state
      console.log("list music is")
      setListMusic(data.music_list);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  async function searchMusic(keyword: string){
    // Fetch data from the FastAPI endpoint
    await fetch(`http://127.0.0.1:8000/searchMusic/${keyword}`)
    .then(response => response.json())
    .then(data => {
      // Set the fetched data to the state
      console.log(data)
      setListMusic(data);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  useEffect(() => {

    if (!keyword) {
      console.log("loading list music...")
      getListMusic();
    } else {
      searchMusic(keyword);
    }

  }, [keyword]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-20">
      {keyword && <h1 className={title({ color: "violet" })}>{keyword}</h1>}
      <div className='pb-36 lg:pb-0 flex items-center justify-center'>
        {listMusic ? <CardArea songData={listMusic} /> : <h1>loading...</h1>}
      </div>
    </div>
  );
}

// import { Link } from "@nextui-org/link";  // ลบออกเพราะไม่ได้ใช้งาน
// import { Snippet } from "@nextui-org/snippet";  // ลบออกเพราะไม่ได้ใช้งาน
// import { Code } from "@nextui-org/code";  // ลบออกเพราะไม่ได้ใช้งาน
// import { button as buttonStyles } from "@nextui-org/theme";  // ลบออกเพราะไม่ได้ใช้งาน

// import { siteConfig } from "@/config/site";  // ลบออกเพราะไม่ได้ใช้งาน
// "use client"
// import { Link } from "@nextui-org/link";
// import { Snippet } from "@nextui-org/snippet";
// import { Code } from "@nextui-org/code";
// import { button as buttonStyles } from "@nextui-org/theme";

// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";

// import { useSearchParams } from 'next/navigation';
// import {Card, CardFooter, Image, Button} from "@nextui-org/react";

// const CardItem = () => {
//   return(
//     <Card
//     isFooterBlurred
//     radius="lg"
//     className="border-none"
//   >
//     <Image
//       alt="Woman listing to music"
//       className="object-cover"
//       height={200}
//       src="https://nextui.org/images/hero-card.jpeg"
//       width={200}
//     />
//     <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
//       <p className="text-tiny text-white/80">Name Music</p>
//       <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
//         Key Original C
//       </Button>
//     </CardFooter>
//   </Card>
//   )
// }

// export default function Home() {
//   const searchParams = useSearchParams();
//   const keyword = searchParams.get('keyword');
//   return (
//     <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//       <h1 className={title()}>Home</h1>
//       {keyword && <p>Search Keyword: {keyword}</p>}
//       <CardItem/>
//     </section>
//   );
// }


      {/* <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Make&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
        <br />
        <h1 className={title()}>
          websites regardless of your design experience.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </h2>
      </div> */}

      {/* <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}