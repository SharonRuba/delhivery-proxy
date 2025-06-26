export default async function handler(req, res) {
  // ✅ Allowlisted Origins
  const allowedOrigins = [
    "https://ramawaterfilter.com",
    "https://your-preview.myshopify.com"
  ];

  const origin = req.headers.origin || "";

  // ✅ Set CORS headers
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin.startsWith("file://") || origin === "") {
    // Special handling for local `file://` testing or no origin
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔐 Delhivery API token (keep private!)0cb64308e902998d445065f64a222c80a393753a
  const token = "";

  // ✅ Extract query parameters
  const {
    destination_pin,
    origin_pin = "600115",
    mot = "S",
    pdt = "B2C",
    expected_pickup_date
  } = req.query;

  // ❌ Validate required inputs
  if (!destination_pin || !expected_pickup_date) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  // ✅ Build Delhivery API URL
  const url = `https://track.delhivery.com/api/dc/expected_tat?origin_pin=${origin_pin}&destination_pin=${destination_pin}&mot=${mot}&pdt=${pdt}&expected_pickup_date=${encodeURIComponent(expected_pickup_date)}`;

  try {
    // ✅ Call Delhivery API server-to-server
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Delhivery API error:", err);
    return res.status(500).json({ error: "Failed to fetch ETA" });
  }
}
