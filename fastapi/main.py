import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from services.web_scraping import initialize_browser, close_browser

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    await initialize_browser()

# asyncio.get_event_loop().run_until_complete(initialize_browser())

@app.on_event("shutdown")
async def shutdown_event():
    await close_browser()

@app.get("/")
def read_root():
    return {"message": "Hello World"}