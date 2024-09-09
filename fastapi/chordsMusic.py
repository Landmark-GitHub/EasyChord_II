import asyncio
from pyppeteer import launch

async def load_data(id: int):
    
    data = []
    
    # Content Selectors
    selectors = {
        ##post-363420 > section:nth-child(1) > div > div > div.single-cover-header > div.single-cover-header-info > div > h1
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
        #"origin": data_dict.get("text", ""),
        "text": lyrics,
        #"text": data_dict["text"]
    })
    
    return data

def separate_lyrics_and_chords(text, chords):
    lines = text.strip().split('\n')
    result = []
    for line in lines:
        if "INTRO" in line or "INSTRU" in line:
            result.append({
                'text': line.strip(),
                'chords': '',
                'rest_text': ''
            })
        elif any(chord in line for chord in chords):
            for chord in chords:
                if chord in line:
                    parts = line.split(chord)
                    resultText = parts[0].strip()
                    restText = parts[1].strip()
                    result.append({
                        'text': resultText,
                        'chords': chord,
                        'rest_text': restText
                    })
                    break
        else:
            result.append({
                'text': line.strip(),
                'chords': '',
                'resttext': ''
            })

    return result

async def simulator(url, id, action, count):
    try:
        browser = await launch(headless=True, executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe')
        page = await browser.newPage()
        await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 0})
        
        if action == '' and count == 0:
            content = await simulator(url, id)
            return content
        elif action == 'addkey' and count >= 1:
            content = await simulator(url, id, action, count)
            return content
        
        elif action == 'reducekey' and count >= 1:
            return {"message": f"Reduced {count} keys from {id}"}
        
        else:
            return {"message": f"Chord ID {id} not found or invalid action/count combination"}

        return data
    
    except Exception as e:
        print(f"An error occurred: {e}")
        if 'browser' in locals() and browser is not None:
            await browser.close()
        return []


