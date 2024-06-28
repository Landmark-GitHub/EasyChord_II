from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pyppeteer import launch
import asyncio
import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen
from chordsMusic import simulator

app = FastAPI()

# Allow all origins to access your API (replace * with specific origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/listMusic")
async def list_music():
    url = "https://www.dochord.com"
    try:
        res = requests.get(url)
        res.raise_for_status()  # Raise an exception for any HTTP errors
        html_data = res.content
        parsed_data = BeautifulSoup(html_data, "html.parser")

        music_list_section = parsed_data.select_one('body > div.section-third > div > div:nth-child(1) > div')

        if music_list_section:
            music_items = music_list_section.select('div.section-third-song-list> div')
            music_details = []
            for item in music_items:
                title = item.select_one('h3').text.strip()
                link = item.select_one('a')['href']

                img_tag = item.select_one('a > img')
                img_url = img_tag['data-src'] if img_tag and 'data-src' in img_tag.attrs else None
                srcset = img_tag['data-srcset'] if img_tag and 'data-srcset' in img_tag.attrs else None
                if srcset:
                    srcset_parts = srcset.split(', ')
                    img_url = srcset_parts[-1].split(' ')[0] if srcset_parts else img_url
                
                code =  str(link).split("/")

                music_details.append({
                    'title': title,
                    'image': img_url,
                    'code': code[3],
                })

            # await html_data.close()

            return {"music_list": music_details}
        else:
            raise HTTPException(status_code=500, detail="Music section not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/searchMusic/{searchMusic_id}")
async def search(searchMusic_id: str):
    name = searchMusic_id
    url = f"https://www.dochord.com/search/?q={name}#gsc.tab=0&gsc.q={name}&gsc.page=1"

    try:
        # Specify the path to your Chrome executable
        browser = await launch(headless=True, executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe')
        page = await browser.newPage()
        await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 0})

        count = 1
        data = []

        while True:
            selectorName = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a"
            selectorURL = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div.gs-webResult.gs-result > div.gsc-url-top > div.gs-bidi-start-align.gs-visibleUrl.gs-visibleUrl-long"
            selectorImage = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div > div.gsc-table-result > div.gsc-table-cell-thumbnail.gsc-thumbnail > div > a > img"

            nameElement, urlElement, imageElement = await asyncio.gather(
                page.waitForSelector(selectorName),
                page.waitForSelector(selectorURL),
                page.waitForSelector(selectorImage),
            )

            textRequestName = await page.evaluate('(element) => element.textContent', nameElement)
            textRequestURL = await page.evaluate('(element) => element.textContent', urlElement)
            imageUrl = await page.evaluate('(element) => element.getAttribute("src")', imageElement)
            
            last_slash_index = str(textRequestURL).split("/")
            numeric_value =  last_slash_index[3]
            
            data.append({
                "title": textRequestName,
                "image": imageUrl,
                "code": numeric_value,
                "url": textRequestURL,
                "code2":"dsf",
            })

            count += 1
            nextSelector = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a"
            
            nextRequest = await page.querySelector(nextSelector)
            if not nextRequest:
                break

        await browser.close()
        return data
    except Exception as e:
        print('Puppeteer error:', e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chordsMusic/{chords_id}")
async def chords_music(chords_id: str):
    url = f"https://www.dochord.com/{chords_id}/"
    content = await simulator(url, chords_id)
    return content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
