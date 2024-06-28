import asyncio
from pyppeteer import launch

async def simulator(url, id):
    try:
        browser = await launch(headless=True, executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe')
        page = await browser.newPage()
        await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 0})

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
        if elements["name"]:
            data_dict["title"] = await page.evaluate('(element) => element.textContent', elements["name"])
        if elements["key"]:
            data_dict["key"] = await page.evaluate('(element) => element.textContent', elements["key"])
        if elements["capo"]:
            data_dict["capo"] = await page.evaluate('(element) => element.textContent', elements["capo"])
        if elements["image"]:
            data_dict["image"] = await page.evaluate('(element) => element.getAttribute("src")', elements["image"])
        if elements["chord"]:
            data_dict["chord"] = await page.evaluate('(element) => element.textContent', elements["chord"])
        if elements["text"]:
            data_dict["text"] = await page.evaluate('(element) => element.textContent', elements["text"])

        if "chord" in data_dict:
            chords = [i.replace('คอร์ด ', '') for i in data_dict["chord"].split(', ')]
        else:
            chords = []

        if "text" in data_dict:
            temp = data_dict["text"].strip().split("\n\n")
            lyrics = []

            for section in temp:
                if section.startswith("INTRO") or section.startswith("INSTRU"):
                    lyrics.append({"text": section, "chord": None})
                else:
                    lines = section.split("\n")
                    for line in lines:
                        found_chord = None
                        words = line.split()
                        for word in words:
                            if word.strip(".,!?:;'\"()[]{}").strip() in chords:
                                found_chord = word.strip(".,!?:;'\"()[]{}").strip()
                                break  # Break after finding the first chord
                        lyrics.append({"text": line, "chord": found_chord})

            print(lyrics) 
            lines = lyrics

        else:
            lines = []


        data.append({
            "title": data_dict.get("title", ""),
            "key": data_dict.get("key", ""),
            "capo": data_dict.get("capo", ""),
            "image": data_dict.get("image", ""),
            "chord": chords,
            "text": data_dict.get("text", ""),
        })

        await browser.close()
        return data
    
    except Exception as e:
        print(f"An error occurred: {e}")
        if 'browser' in locals():
            await browser.close()
        return []
    
def parse_song_data(song_text):
    # Initialize variables to hold sections
    intro = ""
    instru = []
    textchord = []

    # Patterns to identify chords and lines
    intro_pattern = r'INTRO : (.*)'
    instru_pattern = r'INSTRU : (.*)'
    chord_pattern = r'([A-G][#b]?m?|null)'