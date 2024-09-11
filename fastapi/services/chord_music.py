from fastapi import HTTPException
import requests
from bs4 import BeautifulSoup
from services.web_scraping import get_page
from utils.helpers import separate_lyrics_and_chords

async def list_music():
    url = "https://www.dochord.com"
    try:
        res = requests.get(url)
        res.raise_for_status()
        html_data = res.content
        parsed_data = BeautifulSoup(html_data, "html.parser")

        music_list_section = parsed_data.select_one('body > div.section-third > div > div:nth-child(1) > div')

        if music_list_section:
            music_items = music_list_section.select('div.section-third-song-list > div')
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

                code = str(link).split("/")

                music_details.append({
                    'title': title,
                    'image': img_url,
                    'code': code[3],
                })

            return {"music_list": music_details}
        else:
            raise HTTPException(status_code=500, detail="Music section not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def chords_music(id: str):
    url = f"https://www.dochord.com/{id}/"
    page = get_page()
    await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 0})

    try:
        data = await load_lyrics(page, id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def chords_music_plus(id: str, count: int):
    url = f"https://www.dochord.com/{id}/"
    page = get_page()
    await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 0})

    try:
        if count > 0:
            for _ in range(count):
                selector = f"#post-{id} > section:nth-child(4) > div.single-key > div.single-key__select > a.single-key__select-plus"
                await page.click(selector)
        elif count < 0:
            count = abs(count)
            for _ in range(count):
                selector = f"#post-{id} > section:nth-child(4) > div.single-key > div.single-key__select > a.single-key__select-minus"
                await page.click(selector)
        elif count == 0:
            # Handle the case where count is zero
            return {"message": "No changes made, count is zero."}

        data = await load_lyrics(page, id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def load_lyrics(page, id):
    try:
        data = []
        # Content Selectors
        selectors = {
            "name": f"#post-{id} > section:nth-child(1) > div > div > div.single-cover-header > div.single-cover-header-info > div > h1",
            "key": f"#post-{id} > section:nth-child(4) > div.single-key > div.single-key__select > div",
            "capo": f"#post-{id} > section:nth-child(4) > div.single-key > div.single-key__desc",
            "image": f"#post-{id} > section:nth-child(1) > div > div > div.single-cover-header > div.single-cover-header__thumbnail > img",
            "chord": f"#post-{id} > section:nth-child(2) > div.archive-desc > p",
            "text": f"#post-{id} > section:nth-child(5) > div > div"
        }

        # Elements retrieval with individual try-except blocks
        elements = {}
        for key, selector in selectors.items():
            try:
                elements[key] = await page.waitForSelector(selector, {'timeout': 60000})
            except Exception as e:
                print(f"Error waiting for selector {selector}: {e}")
                elements[key] = None

        # Extract data if elements are found
        data_dict = {}
        for key, element in elements.items():
            if element:
                if key == "image":
                    data_dict[key] = await page.evaluate('(element) => element.getAttribute("src")', element)
                else:
                    data_dict[key] = await page.evaluate('(element) => element.textContent', element)

        if "chord" in data_dict:
            chords = [i.replace('คอร์ด ', '') for i in data_dict["chord"].split(', ')]
        else:
            chords = []

        if "text" in data_dict:
            lyrics = separate_lyrics_and_chords(data_dict["text"], chords)
        else:
            lyrics = []

        data.append({
            "title": data_dict.get("name", ""),
            "key": data_dict.get("key", ""),
            "capo": data_dict.get("capo", ""),
            "image": data_dict.get("image", ""),
            "chord": chords,
            "text": lyrics,
        })

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
