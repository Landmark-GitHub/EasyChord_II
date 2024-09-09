from pyppeteer import launch

browser = None
page = None

async def initialize_browser():
    global browser, page
    browser = await launch(headless=True, executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe')
    page = await browser.newPage()

async def close_browser():
    global browser
    if browser:
        await browser.close()

def get_page():
    return page