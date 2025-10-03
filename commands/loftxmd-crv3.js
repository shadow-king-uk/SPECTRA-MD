import fetch from "node-fetch";
import fs from "fs";

const API_KEY = "a7a9a1fc750264b40f6270aa";

/**
 * crv3 - Generate AI video (Premium only)
 * @param {string} prompt - Description of the video
 * @param {number} duration - Duration in seconds (45–50)
 * @param {string} outputFile - Output file name
 */
async function crv3(prompt, duration = 45, outputFile = "crv3_output.mp4") {
  if (duration < 45 || duration > 50) {
    throw new Error("Duration must be between 45 and 50 seconds.");
  }

  // Premium user check
  const isPremium = true; // Replace with your real subscription logic
  if (!isPremium) {
    console.log("❌ This command is available for Premium users only.");
    return;
  }

  const response = await fetch("https://api.stability.ai/v2beta/video/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      duration,
      resolution: "1080p",
      output_format: "mp4"
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("⚠️ Error:", error);
    return;
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputFile, Buffer.from(buffer));
  console.log(`✅ Video generated: ${outputFile}`);
}

// Example usage
(async () => {
  await crv3("A futuristic city at night with neon lights and flying cars", 47);
})();


