"""
Script to remove duplicate stars from the database.
Keeps the first occurrence of each star (lowest ID) and deletes the rest.
"""
import asyncio
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal
from models import Star


async def remove_duplicates():
    """Remove duplicate stars, keeping only the first occurrence of each name."""
    async with AsyncSessionLocal() as session:
        try:
            # Find duplicate names
            # This query finds all star names that appear more than once
            duplicate_query = (
                select(Star.name, func.count(Star.id).label('count'))
                .group_by(Star.name)
                .having(func.count(Star.id) > 1)
            )
            result = await session.execute(duplicate_query)
            duplicates = result.all()
            
            if not duplicates:
                print("✅ No duplicates found in the database.")
                return
            
            print(f"Found {len(duplicates)} stars with duplicate names:")
            for name, count in duplicates:
                print(f"  - {name}: {count} occurrences")
            
            total_deleted = 0
            
            # For each duplicate name, keep the first (lowest ID) and delete the rest
            for name, count in duplicates:
                # Get all stars with this name, ordered by ID
                stars_query = select(Star).where(Star.name == name).order_by(Star.id)
                result = await session.execute(stars_query)
                stars = result.scalars().all()
                
                # Keep the first one (lowest ID), delete the rest
                kept_star = stars[0]
                stars_to_delete = stars[1:]
                
                print(f"\nKeeping {kept_star.name} (ID: {kept_star.id})")
                for star in stars_to_delete:
                    await session.delete(star)
                    print(f"  Deleted duplicate: {star.name} (ID: {star.id})")
                    total_deleted += 1
            
            await session.commit()
            print(f"\n✅ Successfully removed {total_deleted} duplicate stars!")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(remove_duplicates())

