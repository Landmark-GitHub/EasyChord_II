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

def load_lyrics(id, page): 
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
            elements[key] = page.waitForSelector(selector, {'timeout': 60000})
        except Exception as e:
            print(f"Error waiting for selector {selector}: {e}")
            elements[key] = None
    # Extract data if elements are found
    data_dict = {}
    for key, element in elements.items():
        if element:
            if key == "image":
                data_dict[key] = page.evaluate('(element) => element.getAttribute("src")', element)
            else:
                data_dict[key] = page.evaluate('(element) => element.textContent', element)

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