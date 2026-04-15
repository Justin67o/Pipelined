import httpx
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

BOILERPLATE_PHRASES = [
    "skip to main content",
    "skip to content",
    "accept cookies",
    "decline cookies",
    "cookie policy",
    "privacy policy",
    "we use cookies",
    "we and selected third parties",
    "click from the options below",
    "read full privacy message",
    "page is loaded",
]

async def scrape(url: str) -> str:

    # Try simple httpx 
    text = await scrape_static(url)

    # If httpx doesn't work, try playwright 
    if len(text.strip()) < 200:
        text = await scrape_dynamic(url)

    # if both don't work, error
    if len(text.strip()) < 200:
        raise ValueError("Could not extract job description from URL, please paste manually.")

    # return the result
    return text

def extract_text(soup: BeautifulSoup) -> str:

    # loop through and find all html script, style, nav, header, and footer tags and destory them
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()

    # loop through all HTML elements that match any of these selectors and destroy them
    for tag in soup.select(
        '[id*="cookie"], [class*="cookie"],'
        '[id*="consent"], [class*="consent"],'
        '[id*="banner"], [class*="banner"],'
        '[role="dialog"], [aria-modal="true"]'
    ):
        tag.decompose()

    # try to find the main content
    main = soup.find("main") or soup.find(id="main") or soup.find(id="main-content")
    target = main if main else soup

    # extract all visible text from HTML elements, stripping leading/trailing spaces
    raw = target.get_text(separator="\n", strip=True)

    lines = []

    # look at each individual line and only keep meaningful content
    for line in raw.splitlines():
        # remove leading/trailing spaces
        stripped = line.strip()

        # skip blank lines
        if not stripped:
            continue
        # skip lines with boilerplate (useless)
        if any(phrase in stripped.lower() for phrase in BOILERPLATE_PHRASES):
            continue
        lines.append(stripped)

    return "\n".join(lines)

async def scrape_static(url: str) -> str:

    # create and manage an http client within a context
    async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:

        # send a GET request from the client
        response = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
        # use beautiful soup html parser to parse the html
        soup = BeautifulSoup(response.text, "html.parser")
        # extract the text from the html
        return extract_text(soup)

async def scrape_dynamic(url: str) -> str:

    # create and manage a playwright instance
    async with async_playwright() as p:

        # open a headless chrome page
        browser = await p.chromium.launch(headless=True)
        # open a new chrome page
        page = await browser.new_page()
        # go to the url until everything is fully loaded
        await page.goto(url, wait_until="networkidle", timeout=15000)
        # grab the html content of the page
        content = await page.content()
        await browser.close()

        # parse the html content
        soup = BeautifulSoup(content, "html.parser")

        # extract the useful text
        return extract_text(soup)
