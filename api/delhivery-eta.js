export default async function handler(req, res) {
  // ✅ CORS Header to allow browser access from Shopify
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle CORS preflight (for OPTIONS requests)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Your Delhivery API token
  const token = "0cb64308e902998d445065f64a222c80a393753a";

  // Extract query parameters
  const {
    destination_pin,
    origin_pin = "600115",
    mot = "S",
    pdt = "B2C",
    expected_pickup_date
  } = req.query;

  // Validate inputs
  if (!destination_pin || !expected_pickup_date) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  // Construct Delhivery API URL
  const url = `https://track.delhivery.com/api/dc/expected_tat?origin_pin=${origin_pin}&destination_pin=${destination_pin}&mot=${mot}&pdt=${pdt}&expected_pickup_date=${encodeURIComponent(expected_pickup_date)}`;

  try {
    // Call Delhivery API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    // Send response to frontend
    return res.status(200).json(data);

  } catch (err) {
    console.error("Delhivery API error:", err);
    return res.status(500).json({ error: "Failed to fetch ETA" });
  }
}
