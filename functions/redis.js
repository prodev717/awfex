import { createClient } from "redis";

let Redis;

function getRedis() {
    if (!Redis) {
        Redis = createClient({
            url: process.env.REDIS_URL,
        });
        Redis.connect().catch((err) => {
            console.error("Redis connection error:", err);
        });
    }
    return Redis;
}

/**
 * Redis node for workflow engine
 * Supports GET, SET, DEL, EXPIRE, and JSON storage.
 */
export async function redis(action, key, value = null, ttl = null) {
    const client = getRedis();
    try {
        switch (action.toLowerCase()) {
            case "get": {
                const result = await client.get(key);
                try {
                    return JSON.parse(result);
                } catch {
                    return result;
                }
            }
            case "set": {
                const data = typeof value === "string" ? value : JSON.stringify(value);
                if (ttl) {
                    await client.set(key, data, { EX: ttl });
                } else {
                    await client.set(key, data);
                }
                return "OK";
            }
            case "delete":
            case "del": {
                await client.del(key);
                return "DELETED";
            }
            case "expire": {
                await client.expire(key, ttl ?? 60);
                return "EXPIRE_SET";
            }
            default:
                return `Unknown Redis action: ${action}`;
        }
    } catch (err) {
        console.error("Redis Node Error:", err);
        return null;
    }
}

export const redisDescription = `
redis(action, key, value = null, ttl = null):
- A Redis utility function for reading/writing cached data.
- Automatically handles JSON stringify/parse.

Actions:
  "get"       — Returns stored value (auto-parsed if JSON)
  "set"       — Stores value (string or JSON). Optional TTL.
  "del"       — Deletes a key.
  "expire"    — Updates TTL for an existing key.

Parameters:
  action: String — Redis command ("get", "set", "del", "expire")
  key: String — Redis key
  value: Any — Value to store (optional for GET/DEL)
  ttl: Number — Optional TTL (in seconds)

Returns:
  Any — Stored value, retrieved value, or status string.
`;

export const redisMetadata = {
    parameters: ["Action", "Key", "Value", "TTL"],
    icon: "https://img.icons8.com/color/48/redis.png",
    hasVariableParams: false
};
