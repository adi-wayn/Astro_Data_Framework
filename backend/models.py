"""
SQLAlchemy models for the astro data framework.
"""
from sqlalchemy import Column, Integer, String, Float
from database import Base


class Star(Base):
    """
    Star model representing a star in the database.
    """
    __tablename__ = "stars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    magnitude = Column(Float, nullable=False)
    distance = Column(Float, nullable=False)  # Distance in light-years
    spectral_type = Column(String, nullable=False)

