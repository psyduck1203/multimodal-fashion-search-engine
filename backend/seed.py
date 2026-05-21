"""
Seed the database with sample clothing items using Pexels placeholder images.
Images are fetched from Pexels and saved locally for embedding.
"""

import os
import uuid
import urllib.request
from pathlib import Path
from database import MetadataDB

DATA_DIR = Path(os.getenv("DATA_DIR", "../data/images"))

SAMPLE_ITEMS = [
    {
        "category": "t-shirt",
        "description": "Classic white crew neck t-shirt, casual everyday wear",
        "url": "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "tshirt_white.jpg",
    },
    {
        "category": "t-shirt",
        "description": "Black graphic t-shirt with minimal design",
        "url": "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "tshirt_black.jpg",
    },
    {
        "category": "jeans",
        "description": "Blue slim fit denim jeans, versatile everyday trousers",
        "url": "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "jeans_blue.jpg",
    },
    {
        "category": "jeans",
        "description": "Dark wash straight leg jeans, modern cut",
        "url": "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "jeans_dark.jpg",
    },
    {
        "category": "dress",
        "description": "Floral summer dress, light and breezy feminine style",
        "url": "https://images.pexels.com/photos/1375736/pexels-photo-1375736.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "dress_floral.jpg",
    },
    {
        "category": "dress",
        "description": "Black cocktail dress, elegant evening wear",
        "url": "https://images.pexels.com/photos/2853592/pexels-photo-2853592.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "dress_black.jpg",
    },
    {
        "category": "jacket",
        "description": "Leather biker jacket, edgy and stylish outerwear",
        "url": "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "jacket_leather.jpg",
    },
    {
        "category": "jacket",
        "description": "Denim jacket, casual layering piece",
        "url": "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "jacket_denim.jpg",
    },
    {
        "category": "sneakers",
        "description": "White minimalist sneakers, clean everyday footwear",
        "url": "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "sneakers_white.jpg",
    },
    {
        "category": "sneakers",
        "description": "Black running sneakers, sporty athletic shoes",
        "url": "https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "sneakers_black.jpg",
    },
    {
        "category": "hoodie",
        "description": "Grey pullover hoodie, cozy and comfortable streetwear",
        "url": "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "hoodie_grey.jpg",
    },
    {
        "category": "hoodie",
        "description": "Navy blue zip-up hoodie with front pocket",
        "url": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "hoodie_navy.jpg",
    },
    {
        "category": "skirt",
        "description": "Pleated midi skirt, elegant feminine silhouette",
        "url": "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "skirt_pleated.jpg",
    },
    {
        "category": "skirt",
        "description": "Mini denim skirt, casual summer style",
        "url": "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "skirt_denim.jpg",
    },
    {
        "category": "shirt",
        "description": "White button-down oxford shirt, smart casual look",
        "url": "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "shirt_oxford.jpg",
    },
    {
        "category": "shirt",
        "description": "Plaid flannel shirt, warm and cozy layering piece",
        "url": "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "shirt_flannel.jpg",
    },
    {
        "category": "coat",
        "description": "Camel wool trench coat, classic outerwear staple",
        "url": "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "coat_trench.jpg",
    },
    {
        "category": "coat",
        "description": "Black puffer coat, warm winter insulation",
        "url": "https://images.pexels.com/photos/1183267/pexels-photo-1183267.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "coat_puffer.jpg",
    },
    {
        "category": "shorts",
        "description": "Khaki chino shorts, summer casual wear",
        "url": "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "shorts_chino.jpg",
    },
    {
        "category": "shorts",
        "description": "Athletic running shorts, performance sportswear",
        "url": "https://images.pexels.com/photos/1661682/pexels-photo-1661682.jpeg?auto=compress&cs=tinysrgb&w=400",
        "filename": "shorts_athletic.jpg",
    },
]


def download_image(url: str, save_path: Path) -> bool:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            with open(save_path, "wb") as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"  Failed to download {url}: {e}")
        return False


def create_placeholder_image(save_path: Path, category: str):
    """Create a colored placeholder image if download fails."""
    from PIL import Image, ImageDraw, ImageFont
    import hashlib

    color_map = {
        "t-shirt": (70, 130, 180),
        "jeans": (30, 60, 120),
        "dress": (220, 120, 160),
        "jacket": (80, 60, 40),
        "sneakers": (200, 200, 200),
        "hoodie": (100, 100, 120),
        "skirt": (180, 100, 140),
        "shirt": (240, 240, 240),
        "coat": (160, 130, 90),
        "shorts": (120, 160, 100),
    }

    bg_color = color_map.get(category, (128, 128, 128))
    img = Image.new("RGB", (400, 400), bg_color)
    draw = ImageDraw.Draw(img)

    text = category.upper()
    draw.rectangle([60, 140, 340, 260], fill=(255, 255, 255, 180))
    draw.text((200, 200), text, fill=(50, 50, 50), anchor="mm")
    img.save(save_path)


def seed_data(db: MetadataDB):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Seeding {len(SAMPLE_ITEMS)} clothing items into {DATA_DIR}...")

    for item in SAMPLE_ITEMS:
        item_id = str(uuid.uuid4())
        save_path = DATA_DIR / item["filename"]

        if not save_path.exists():
            print(f"  Downloading {item['filename']}...")
            success = download_image(item["url"], save_path)
            if not success:
                print(f"  Creating placeholder for {item['filename']}...")
                create_placeholder_image(save_path, item["category"])

        db.add({
            "id": item_id,
            "image_path": str(save_path),
            "category": item["category"],
            "description": item["description"],
        })

    print(f"Seeded {len(SAMPLE_ITEMS)} items.")


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    db = MetadataDB(os.getenv("METADATA_DB_PATH", "./metadata.json"))
    seed_data(db)
    print("Done!")
