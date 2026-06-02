import os
from google import genai
from google.genai import types

_client: genai.Client | None = None


def get_api_key() -> str:
    return os.getenv("GEMINI_API_KEY", "")


def is_valid_api_key() -> bool:
    key = get_api_key()
    return bool(key) and key != "MY_GEMINI_API_KEY"


def get_ai_client() -> genai.Client:
    global _client
    if _client is None:
        key = get_api_key() or "MOCK_KEY"
        _client = genai.Client(
            api_key=key,
            http_options=types.HttpOptions(
                headers={"User-Agent": "aistudio-build"}
            ),
        )
    return _client


async def generate_text(prompt: str, model: str = "gemini-2.0-flash") -> str:
    client = get_ai_client()
    response = await client.aio.models.generate_content(
        model=model,
        contents=prompt,
    )
    return response.text or ""


async def generate_multimodal(
    parts: list, model: str = "gemini-2.0-flash"
) -> str:
    client = get_ai_client()
    response = await client.aio.models.generate_content(
        model=model,
        contents=parts,
    )
    return response.text or ""
