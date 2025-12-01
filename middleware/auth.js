const API_KEY = process.env.API_KEY || "supersecret";

function auth(req, res, next) {
    const key = req.headers["x-api-key"];
    if (!key || key !== API_KEY) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    next();
}

export default auth;
