const handleApiCall = async (req, res, fetch, PAT) => {
  const { imageUrl } = req.body;

  const MODEL_ID = "face-detection"; // https://clarifai.com/models/face-detection;
  const endpoint = `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: "clarifai",
      app_id: "main",
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json", // ✅ This is the important one
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    const result = await response.json();

    if (
      !result.outputs ||
      !result.outputs[0] ||
      !result.outputs[0].data ||
      !result.outputs[0].data.regions
    ) {
      return res.status(400).json({
        error: "Invalid response format from Clarifai",
        result,
      });
    }

    const regions = result.outputs[0].data.regions;

    // Optional: format the regions like the docs
    const formattedRegions = regions.map((region) => {
      const box = region.region_info.bounding_box;
      const concepts = region.data.concepts?.map((c) => ({
        name: c.name,
        value: c.value.toFixed(4),
      }));

      return {
        boundingBox: {
          top_row: box.top_row.toFixed(3),
          left_col: box.left_col.toFixed(3),
          bottom_row: box.bottom_row.toFixed(3),
          right_col: box.right_col.toFixed(3),
        },
        concepts: concepts || [],
      };
    });

    res.json({ regions: formattedRegions });
  } catch (error) {
    console.error("Clarifai API error:", error);
    res.status(500).json({ error: "Failed to call Clarifai API" });
  }
};

module.exports = {
  handleApiCall: handleApiCall,
};
