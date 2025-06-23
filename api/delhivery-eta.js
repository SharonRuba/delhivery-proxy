export default async function handler(req, res) {
  const token = "0cb64308e902998d445065f64a222c80a393753a"; // Your Delhivery token

  const { destination_pin, origin_pin = "600115", mot = "S", pdt = "B2C", expected_pickup_date } = req.query;

  if (!destination_pin || !expected_pickup_date) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  const url = `https://track.delhivery.com/api/dc/expected_tat?origin_pin=${origin_pin}&destination_pin=${destination_pin}&mot=${mot}&pdt=${pdt}&expected_pickup_date=${encodeURIComponent(expected_pickup_date)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Delhivery API error:", err);
    return res.status(500).json({ error: "Failed to fetch ETA" });
  }
}
