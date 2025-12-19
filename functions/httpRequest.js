export async function httpRequest(url, method = "GET", headers = {}, body = null) {
  const options = {
    method,
    headers: headers || {},
    body: body ?? null
  };

  const response = await fetch(url, options);

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.json()
  };
}

export const httpRequestDescription = `
httpRequest(url, method, headers, body):
- Sends an HTTP request using the given URL, method, headers, and body.
- This node performs **no automatic type conversion**.
- The body is sent EXACTLY as received.
- The response body is returned as JSON.

Parameters:
  url: String — The request URL.
  method: String — HTTP method (GET, POST, PUT, DELETE).
  headers: Object — Optional request headers.
  body: Any — Sent exactly as provided (no JSON stringify or automatic conversion).

Returns:
  Object:
    status: Number — HTTP status code.
    headers: Object — Key-value response headers.
    body: Object — JSON response body.
`;

// Function metadata for frontend
export const httpRequestMetadata = {
  parameters: ["URL", "Method", "Headers", "Body"],
  icon: "/icons/http.png",
  hasVariableParams: false
};
