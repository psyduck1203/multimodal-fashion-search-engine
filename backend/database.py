import json
from pathlib import Path
from typing import List, Optional, Dict, Any


class MetadataDB:
    def __init__(self, path: str):
        self.path = Path(path)
        self._data: Dict[str, Any] = {}
        self._load()

    def _load(self):
        if self.path.exists():
            with open(self.path, "r") as f:
                items = json.load(f)
            self._data = {item["id"]: item for item in items}

    def _save(self):
        with open(self.path, "w") as f:
            json.dump(list(self._data.values()), f, indent=2)

    def add(self, item: Dict[str, Any]):
        self._data[item["id"]] = item
        self._save()

    def get(self, item_id: str) -> Optional[Dict[str, Any]]:
        return self._data.get(item_id)

    def get_all(self) -> List[Dict[str, Any]]:
        return list(self._data.values())

    def delete(self, item_id: str):
        self._data.pop(item_id, None)
        self._save()
