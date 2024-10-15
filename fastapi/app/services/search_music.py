from fastapi import HTTPException
import asyncio
from app.services.web_scraping import get_page

async def search_music(searchMusic_id: str):
    name = searchMusic_id
    url = f"https://www.dochord.com/search/?q={name}#gsc.tab=0&gsc.q={name}&gsc.page=1"

    try:
        # Get page from puppeteer (or Pyppeteer)
        page = get_page()
        await page.goto(url, {'waitUntil': 'networkidle2', 'timeout': 0})

        count = 1
        data = []

        while True:
            print(f"Processing item number: {count}")

            # Selectors for the elements
            selectorName = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a"
            selectorURL = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div.gs-webResult.gs-result > div.gsc-url-top > div.gs-bidi-start-align.gs-visibleUrl.gs-visibleUrl-long"
            selectorImage = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div > div.gsc-table-result > div.gsc-table-cell-thumbnail.gsc-thumbnail > div > a > img"

            try:
                # Gather selectors in parallel to speed up execution
                nameElement, urlElement, imageElement = await asyncio.gather(
                    page.querySelector(selectorName),
                    page.querySelector(selectorURL),
                    page.querySelector(selectorImage)
                )

                # If any of the elements do not exist, break the loop
                if not (nameElement and urlElement and imageElement):
                    break

                # Evaluate elements in parallel
                textRequestName, textRequestURL, imageUrl = await asyncio.gather(
                    page.evaluate('(element) => element.textContent', nameElement),
                    page.evaluate('(element) => element.textContent', urlElement),
                    page.evaluate('(element) => element.getAttribute("src")', imageElement)
                )

                # Process URL to extract a numeric code
                last_slash_index = str(textRequestURL).split("/")
                numeric_value = last_slash_index[3]

                # Append data
                data.append({
                    "title": textRequestName,
                    "image": imageUrl,
                    "code": numeric_value,
                    "url": textRequestURL,
                })

                count += 1

                # Check if there's a next item, break if none
                nextSelector = f"#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child({count}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a"
                nextRequest = await page.querySelector(nextSelector)
                if not nextRequest:
                    break

            except Exception as e:
                print(f"Error or timeout at item {count}: {e}")
                break  # Skip to the next item

        return data

    except Exception as e:
        print('Puppeteer error:', e)
        raise HTTPException(status_code=500, detail=f"Puppeteer error: {str(e)}")
