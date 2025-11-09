"""
FastAPI application for the astro data framework.
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List

from database import get_db, init_db
from models import Star


# Pydantic schemas for request/response
class StarCreate(BaseModel):
    """Schema for creating a new star."""
    name: str
    magnitude: float
    distance: float
    spectral_type: str


class StarResponse(BaseModel):
    """Schema for star response."""
    id: int
    name: str
    magnitude: float
    distance: float
    spectral_type: str

    class Config:
        from_attributes = True


# Initialize FastAPI app
app = FastAPI(title="Astro Data API", version="0.1.0")

# CORS middleware for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup event: initialize database
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    try:
        await init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not initialize database: {e}")
        print("   Please ensure PostgreSQL is running and the database 'astrodb' exists.")
        print("   The server will start, but database operations will fail until PostgreSQL is configured.")


# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Astro Data API"}


# GET /stars - returns all stars
@app.get("/stars", response_model=List[StarResponse])
async def get_stars(db: AsyncSession = Depends(get_db)):
    """
    Get all stars from the database.
    """
    result = await db.execute(select(Star))
    stars = result.scalars().all()
    return stars


# POST /stars - adds a new star
@app.post("/stars", response_model=StarResponse, status_code=201)
async def create_star(star: StarCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new star in the database.
    Prevents duplicates by checking if a star with the same name already exists.
    """
    # Check if star with the same name already exists
    result = await db.execute(select(Star).where(Star.name == star.name))
    existing_star = result.scalar_one_or_none()
    
    if existing_star:
        raise HTTPException(
            status_code=409,
            detail=f"Star with name '{star.name}' already exists (ID: {existing_star.id})"
        )
    
    db_star = Star(
        name=star.name,
        magnitude=star.magnitude,
        distance=star.distance,
        spectral_type=star.spectral_type
    )
    db.add(db_star)
    await db.commit()
    await db.refresh(db_star)
    return db_star


# DELETE /stars/{star_id} - deletes a star by ID
@app.delete("/stars/{star_id}", status_code=204)
async def delete_star(star_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a star from the database by ID.
    """
    result = await db.execute(select(Star).where(Star.id == star_id))
    star = result.scalar_one_or_none()
    
    if not star:
        raise HTTPException(
            status_code=404,
            detail=f"Star with ID {star_id} not found"
        )
    
    db.delete(star)
    await db.commit()
    return


# GET /stars/{star_id} - get a single star by ID
@app.get("/stars/{star_id}", response_model=StarResponse)
async def get_star(star_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a single star by ID.
    """
    result = await db.execute(select(Star).where(Star.id == star_id))
    star = result.scalar_one_or_none()
    
    if not star:
        raise HTTPException(
            status_code=404,
            detail=f"Star with ID {star_id} not found"
        )
    
    return star

