"""
Configuration settings for the application using environment variables.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Falls back to sensible defaults if not provided.
    """
    # Database settings
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: Optional[str] = None
    db_name: str = "astrodb"
    
    # Application settings
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @property
    def database_url(self) -> str:
        """
        Construct the database URL from individual components.
        Formats: postgresql+asyncpg://user:password@host:port/dbname
        or: postgresql+asyncpg://user@host:port/dbname (if no password)
        """
        if self.db_password:
            return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
        else:
            return f"postgresql+asyncpg://{self.db_user}@{self.db_host}:{self.db_port}/{self.db_name}"


# Create a global settings instance
settings = Settings()

