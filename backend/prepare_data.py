import pandas as pd
import os
import json

DATA_PATH = "../data"
IMAGE_FOLDER = os.path.join(DATA_PATH, "images")
CSV_PATH = os.path.join(DATA_PATH, "styles.csv")

df = pd.read_csv(CSV_PATH, on_bad_lines='skip')
Df = pd.head(1000)

data = []

for _, row in df.iterrows():
    image_file = f"{row['id']}.jpg"
    image_path = os.path.join(IMAGE_FOLDER, image_file)

    if os.path.exists(image_path):
        item = {
    		"id": str(row["id"]),
    		"image_path": f"../data/images/{image_file}",
    		"category": row["articleType"],
    		"description": f"{row['baseColour']} {row['articleType']} for {row['gender']} - {row['usage']}"
	}
        data.append(item)

# Save cleaned data
with open(os.path.join(DATA_PATH, "metadata.json"), "w") as f:
    json.dump(data, f, indent=2)

print(f"Saved {len(data)} items")