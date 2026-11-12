from fastapi import FastAPI

app = FastAPI(title="SlotSpot MJ API")


@app.get("/salud")
def salud() -> dict[str, str]:
    return {"estado": "ok"}
