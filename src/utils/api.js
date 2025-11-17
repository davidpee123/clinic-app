export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    let data = {};

    try {
      data = await response.json();
    } catch (err) {
      console.error("Failed to parse JSON:", err);
    }

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err;
  }
}
