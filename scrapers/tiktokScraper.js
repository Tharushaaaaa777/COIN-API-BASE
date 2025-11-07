const axios = require('axios');
const qs = require('qs');
const creator = '@Tharuzz-ofc';

async function tiktok(url, count = 12, cursor = 0, web = 1, hd = 1) {
    if (!url) throw new Error("URL is required");

    try {
        const baseUrl = "https://tikwm.com";
        const payload = qs.stringify({
            url,
            count,
            cursor,
            web,
            hd
        });

        const headers = {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': baseUrl,
            'referer': baseUrl
        };

        const response = await axios.post("https://tikwm.com/api/", payload, { headers });

        if (response.status !== 200) {
            throw new Error(`API request failed: HTTP ${response.status}`);
        }

        const data = response?.data?.data;
        if (!data) throw new Error("Invalid response from API.");

        const fixUrl = (url) => (url?.startsWith("http") ? url : baseUrl + url);

        return { 
            success: true, 
            creator: creator, 
            code: response.status, 
            result: {
                id: data.id,
                region: data.region,
                title: data.title,
                cover: fixUrl(data.cover),
                duration: data.duration,
                play: fixUrl(data.play),
                sd: fixUrl(data.wmplay),
                hd: fixUrl(data.hdplay),
                music: fixUrl(data.music),
                play_count: data.play_count,
                digg_count: data.digg_count,
                comment_count: data.comment_count,
                share_count: data.share_count,
                download_count: data.download_count,
                collect_count: data.collect_count,
            }
        };
    } catch (error) {
        console.error("Error fetching TikTok video:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { tiktok };
