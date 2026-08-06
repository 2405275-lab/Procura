import os
import json
from typing import Optional, Any
from loguru import logger

try:
    import redis
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()  # Verify connection
    logger.info("Redis cache backend connected successfully.")
except Exception as e:
    redis_client = None
    logger.warning(f"Redis connection failed. Falling back to local in-memory caching: {str(e)}")

# Memory fallback storage
MEM_CACHE = {}

class CacheManager:
    def get(self, key: str) -> Optional[Any]:
        if redis_client:
            try:
                val = redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception:
                pass
        return MEM_CACHE.get(key)

    def set(self, key: str, value: Any, expire_sec: int = 300):
        if redis_client:
            try:
                redis_client.setex(key, expire_sec, json.dumps(value))
                return
            except Exception:
                pass
        MEM_CACHE[key] = value

    def invalidate(self, key: str):
        if redis_client:
            try:
                redis_client.delete(key)
                return
            except Exception:
                pass
        if key in MEM_CACHE:
            del MEM_CACHE[key]

cache_manager = CacheManager()
