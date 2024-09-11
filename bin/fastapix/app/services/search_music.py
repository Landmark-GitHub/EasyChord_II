from fastapi import HTTPException
import asyncio
from app.services.web_scraping import get_page

async def search_music(searchMusic_id: str):
    name = searchMusic_id
    url = f"https://www.dochord.com/search/?q={name}#gsc.tab=0&gsc.q={name}&gsc.page=1"

    try:
        page = get_page()
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

        return data
    except Exception as e:
        print('Puppeteer error:', e)
        raise HTTPException(status_code=500, detail=str(e))