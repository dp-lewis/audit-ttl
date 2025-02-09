# TTL Audit Script

This Node.js script fetches TTL (Time-To-Live) values from a list of URLs by checking their HTTP response headers. It extracts:
- `Cache-Control`: Defines how long responses are cached.
- `Age`: Shows how long the content has been in the cache.
- `Fastly-Cache-Status`: Shows if the request was a `HIT`, `MISS`, `BYPASS`, etc.

It writes the results to a CSV file for easy analysis in spreadsheets.

## 🚀 Features
✅ Fetch TTL values from multiple URLs  
✅ Supports **Fastly** and other CDNs  
✅ Writes results to a **CSV file**  
✅ **Throttles requests** to prevent rate limits  
✅ Customizable **delay** between requests  

---

## 📄 Usage

### **1. Create a file with URLs**
Create a file called `urls.txt` and list the URLs (one per line):

```
https://example.com
https://your-site.com
https://another-site.com
```

### **2. Run the script**
Execute the script using:
```sh
node audit-ttl.js
```

### Options

- url text file (default: urls.txt)
- csv output file (default: output.csv)
- ms delay between requests  (default: 2000)

The following is the equivilent of running the script with default settings
```
node audit-ttl.js urls.txt output.csv 2000

```