from fastapi import APIRouter
from services.chord_music import list_music, chords_music, chords_music_plus
from services.search_music import search_music

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Hello World"}

@router.get("/listMusic")
async def get_list_music():
    return await list_music()

@router.get("/searchMusic/{searchMusic_id}")
async def search(searchMusic_id: str):
    return await search_music(searchMusic_id)

@router.get("/chordsMusic/{id}")
async def get_simple_chords_music(id: str):
    return await chords_music(id)

@router.get("/chordsMusic/{id}/{count}")
async def get_detailed_chords_music(id: str, count: int):
    return await chords_music_plus(id, count)
