// "use client";
// import { title } from "@/components/primitives";
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// import { useMusic } from '../../contexts/MusicContext';

// export default function BlogPage() {
//   const keyword = useSearchParams().get("code");
//   const {dataMusic, setDataMusic} = useMusic();

//   async function getDataMusic() {
//     // Fetch data from the FastAPI endpoint
//     await fetch(`http://127.0.0.1:8000/chordsMusic/${keyword}`)
//     .then(response => response.json())
//     .then(data => {
//       // Set the fetched data to the state
//       setDataMusic(data);
//     })
//     .catch(error => console.error('Error fetching data:', error));
//   }

//   useEffect(() => {
//     getDataMusic()
//     console.log(dataMusic)
//   })

//   return (
//     <div>
//       {dataMusic ? 
//       <h1 className={title()}>{dataMusic[0].title}</h1> 
//       {dataMusic[0].text.map((text, index) => {

//       })}
//       : 
//       <h1 className={title()}>LOADING...</h1>}
//       <h1>her12</h1>
//     </div>
//   );
// }

"use client";
import { title } from "@/components/primitives";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useMusic } from '../../contexts/MusicContext';
import {ScrollShadow} from "@nextui-org/react";

interface MusicData {
  title: string;
  text: string[];
}

const dataTest = [
  {
      "title": " คอร์ดเพลงHer YENTED ",
      "key": "Key A",
      "capo": "Original Key",
      "image": "https://www.dochord.com/wp-content/uploads/2019/10/YENTED-150x150.jpg",
      "chord": [
          "D",
          "E",
          "C#m",
          "F#7",
          "Dm"
      ],
      "text": [
          "",
          "",
          " INTRO : DE| C#m  F#7  ( 2 Times )  Aey listeDn up girl คุณทำให้โลกของผมมันหยุดE So hot in here เพียงแค่สบC#mสายตา เหมือนโดนสะกด in here EverythingF#7 about you ทำหัวใจหยุด in here  Aey yo girlD, Let me be the oneE You and me เราจะเดินไปด้วยกัน คุณC#mคนเดียวที่วนเวียนอยู่ในฝันF#7 ไม่ว่าหลับหรือว่าตื่นจะมีคุณอยู่ในนั้น  NowD and ever PleasEe say yes ละ let's ride together Trust in meC#m แล้วรับผมเข้าไปเถอะ ถึงจะดู badF#7 boy แต่แบบผมไม่เลอะเทอะ  ทั้งหัวใจจDะรวมกันเป็นหนึ่งเดียว ไม่เEจ้าชู้จะรักคุณแค่คนเดียว จะตะวันหรือพระจันทร์C#m มันก็เหมือนเวลาเดียว จะผ่านนานสักแค่ไหนF#7 จะมีคุณแค่คนเดียว  ผู้คนหลากหลายD ButDm baby you look soC#m shine",
          " แสงไฟสF#7ะท้อนที่ออกมาตาม ร่างกายD.. เธอ.. Dm ทำฉันทนไม่ไหวC#m เลยต้องเข้าF#7ไปทักทาย  แค่อยากที่จะรู้ Dรู้ว่าเธอเEป็นใคร จะได้บอกให้เธอได้รู้ว่C#mาเธอน่ารักเพียงF#7ใด ถ้าไม่ได้เจออีกแล้วD ก็คงไม่แคล้วต้องเสียEใจ ถ้าเราC#mต้องจากกันในคืนนี้ F#7 ฉันเองD.. ก็ขอEแค่เพียง ให้เราได้มาพูดC#mจา ไม่ต้องมากF#7ต้องมาย แค่คำสุดท้ายไม่ใช่คำลาD ให้ได้มีโEอกาสที่เราจะได้มาพบ และใช้เวลาC#m ด้วยกันF#7สักครั้ง  沈みゆくD夕陽を見た 真っ赤に燃えゆくパヤオの街E 今夜C#mは1人でロンリF#7ーナイト no 君ならD付き合ってくれる E 嫌味の一つも言わず ただ慰C#mめてくれよ 連れ出 して迷路 F#7この喧騒にまみれよう",
          "  RowD ya row ya boat 今夜E漕ぎ出そうah 煙で弱C#mくなる思考 で もなんF#7だか寂しくないこの小夜 君がDあってのおれだE YesC#m you are only for me sure that その笑顔F#7 (ああ そうさ 君ならどうだい) Que rico 君の虜  ผู้คนหลากหลายD ButDm baby you look soC#m shine แสงไฟสF#7ะท้อนที่ออกมาตาม ร่างกายD.. เธอ.. Dm ทำฉันทนไม่ไหวC#m เลยต้องเข้าF#7ไปทักทาย  แค่อยากที่จะรู้ Dรู้ว่าเธอเEป็นใคร จะได้บอกให้เธอได้รู้ C#m ว่าเธอน่ารักเพียงF#7ใด ถ้าไม่ได้เจออีกแล้วD ก็คงไม่แคล้วต้องเสียEใจ ถ้าเราC#mต้องจากกันในคืนนี้ F#7 ฉันเองD.. ก็ขอEแค่เพียง ให้เราได้มาพูดC#mจา ไม่ต้องมากF#7ต้องมาย แค่คำสุดท้ายไม่ใช่คำลาD",
          "",
          "ให้ได้มีโEอกาสที่เราจะได้มาพบ",
          "และใช้เวลาC#m ด้วยกันF#7สักครั้ง",
          "",
          "ก่อนจบDคงต้องผ่าน แล้วเรื่องคำทักทายE",
          "และก่อนจากคงไม่จบพร้อมกับ say goodbye",
          "พรุ่งนี้แC#mละต่อไป I want you in my life",
          "That's rightF#7 วู้",
          "",
          "หัวใจผมDมันตกหลุม with your body",
          "ยอมEแลกอะไรก็ได้ with your booty",
          "สมองผมC#mมันสั่งให้หยุดแล้วในคืนนี้",
          "เพราF#7ะคุณคือตัวจริง be my shoty",
          "",
          "ช่วยเปลี่ยนชีวิตDให้ผมมีคุณ",
          "EverEyday just me and you",
          "คำว่ารักC#mของผม is true",
          "เลยอยากF#7ให้คุณมาเป็น my boo เย้",
          "ทุกนาทีแDละคืนวันจนผ่านนานเป็นปี",
          "ไม่เปลี่ยนEใจและเปลี่ยนไป",
          "แค่ only you baby",
          "ยอมC#mให้คุณเป็น number one lady F#7",
          "Just me and you baby",
          "",
          "INSTRU : DE| C#m  F#7  ( 2 Times )",
          "",
          "   Favorite Chords"
      ]
  }
]


export default function BlogPage() {
  const keyword = useSearchParams().get("code");
  const { dataMusic, setDataMusic } = useMusic();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getDataMusic() {
      try {
        console.log('loading detail music...')
        const response = await fetch(`http://127.0.0.1:8000/chordsMusic/${keyword}`);
        const data: MusicData[] = await response.json();
        console.log('detail music is...')
        setDataMusic(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    if (keyword) {
      getDataMusic();
      // setDataMusic(dataTest);
      // setLoading(false);
    }
  }, [keyword, setDataMusic]);

  if (loading) {
    return <h1 className={title()}>LOADING...</h1>;
  }

  return (
    <div className="w-screen absolute top-20 left-0 p-8 md:px-40">
      {dataMusic && dataMusic.length > 0 ? (
        <ScrollShadow size={100} className="w-full md:h-[500px] h-[600px]">
          <h1 className={title()}>{dataMusic[0].title}</h1>
          <ul>
            {dataMusic[0].text.map((text:string[], index:int) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </ScrollShadow>
      ) : (
        <h1 className={title()}>No data found555</h1>
      )}
    </div>
  );
}
