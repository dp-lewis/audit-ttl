const fs = require('fs');
// Get file paths and delay from command-line arguments
const urlsFile = process.argv[2] || "urls.txt"; // File containing URLs
const outputFile = process.argv[3] || "output.csv"; // CSV output file
const delayMs = parseInt(process.argv[4], 10) || 2000; // Delay in milliseconds (default: 2000ms = 2 sec)

// Reads URLs from a file
function readUrls(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data.split("\n").map(line => line.trim()).filter(line => line);
    } catch (error) {
        console.error(`❌ Error reading ${filePath}: ${error.message}`);
        process.exit(1);
    }
}

// Fetch TTL values
async function fetchTTL(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });

        if (!response.ok) {
            console.error(`❌ Error fetching ${url}: ${response.statusText}`);
            return null;
        }

        const cacheControl = response.headers.get("cache-control") || "N/A";
        const age = response.headers.get("age") || "N/A";
        const fastlyCacheStatus = response.headers.get("fastly-cache-status") || "N/A";

        console.log(`✅ Fetched: ${url}`);
        console.log(`  📌 Cache-Control: ${cacheControl}`);
        console.log(`  🕒 Age: ${age} seconds`);
        console.log(`  🚀 Fastly-Cache-Status: ${fastlyCacheStatus}`);
        console.log("----------------------------------");

        return [url, cacheControl, age, fastlyCacheStatus];

    } catch (error) {
        console.error(`❌ Failed to fetch ${url}: ${error.message}`);
        return null;
    }
}

// Sleep function for throttling
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to process URLs with throttling
(async () => {
    const urls = readUrls(urlsFile);
    if (urls.length === 0) {
        console.error("❌ No URLs found in the file.");
        process.exit(1);
    }

    // CSV Header
    const headers = ["URL", "Cache-Control", "Age", "Fastly-Cache-Status"];
    const csvRows = [headers.join(",")];

    for (const url of urls) {
        const result = await fetchTTL(url);
        if (result) {
            csvRows.push(result.map(value => `"${value}"`).join(","));
        }

        console.log(`⏳ Waiting ${delayMs / 1000} seconds before the next request...`);
        await sleep(delayMs);
    }

    // Write to CSV file
    fs.writeFileSync(outputFile, csvRows.join("\n"), "utf8");
    console.log(`📁 Results saved to ${outputFile}`);
})();

// Export for testing
module.exports = { readUrls, fetchTTL, sleep };
