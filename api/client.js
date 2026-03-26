const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function getAuthToken() {
  return localStorage.getItem("auth_token");
}

function toQueryString(params) {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return "";
  const search = new URLSearchParams();
  for (const [k, v] of entries) search.append(k, String(v));
  return `?${search.toString()}`;
}

async function request(method, url, data, config = {}) {
  const headers = { ...(config.headers || {}) };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let finalUrl = `${API_BASE_URL}${url}`;
  if (config.params) finalUrl += toQueryString(config.params);

  const init = {
    method,
    headers,
  };

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(data);
  }

  const res = await fetch(finalUrl, init);
  const contentType = res.headers.get("content-type") || "";
  const parsed = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const error = new Error(parsed?.message || `Request failed: ${res.status}`);
    error.response = { status: res.status, data: parsed };
    throw error;
  }

  return { data: parsed };
}

const apiClient = {
  get: (url, config) => request("GET", url, undefined, config),
  post: (url, data, config) => request("POST", url, data, config),
  put: (url, data, config) => request("PUT", url, data, config),
  delete: (url, config) => request("DELETE", url, undefined, config),
};

export default apiClient;
