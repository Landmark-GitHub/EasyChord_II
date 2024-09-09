from pyppeteer import launch
import asyncio
import os

browser = None
page = None

async def initialize_browser():
    # global browser, page
    # browser = await launch(headless=True, executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe')
    # page = await browser.newPage()
    #version Deploy Docker
    global browser, page
    chrome_path = os.getenv('CHROME_PATH', '/usr/bin/chromium')
    browser = await launch(headless=True, executablePath=chrome_path, args=['--no-sandbox', '--disable-setuid-sandbox'])
    page = await browser.newPage()

async def close_browser():
    global browser
    if browser:
        await browser.close()

def get_page():
    return page



# from pyppeteer import launch
# import asyncio
# import os

# browser = None
# page = None

# async def initialize_browser():
#     global browser, page
#     #browser = await launch(headless=True, executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe')
#     chrome_path = os.getenv('CHROME_PATH', '/usr/bin/chromium-browser')
#     browser = await launch(headless=True, executablePath=chrome_path)
#     #browser = await launch(headless=True, executablePath='/usr/bin/chromium')
#     page = await browser.newPage()

# async def close_browser():
#     global browser
#     if browser:
#         await browser.close()

# def get_page():
#     return page