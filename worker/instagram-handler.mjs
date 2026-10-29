// Latest Instagram posts through the official Instagram API (Instagram Login).
// Needs INSTAGRAM_ACCESS_TOKEN (long-lived token of a professional account).
// Without it, the endpoint answers {configured:false} and the page shows a profile link instead.
const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const imageHost = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/;

function safeImage(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && imageHost.test(url.hostname) ? url.href : '';
  } catch { return ''; }
}

export function shapePosts(data) {
  return (data?.data || []).map(post => ({
    id: String(post.id || ''),
    image: safeImage(post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url),
    url: /^https:\/\/www\.instagram\.com\//.test(post.permalink || '') ? post.permalink : '',
    caption: String(post.caption || '').split('\n')[0].slice(0, 140),
    video: post.media_type === 'VIDEO'
  })).filter(post => post.id && post.image && post.url).slice(0, 12);
}

export function createInstagramHandler({env = process.env, fetchImpl = fetch} = {}) {
  return async function instagram(req, res) {
    const reply = (status, payload, cache) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', cache);
      res.end(JSON.stringify(payload));
    };
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return reply(405, {error: 'method_not_allowed'}, 'no-store');
    }
    const token = env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) return reply(200, {configured: false, posts: []}, 'public, max-age=0, s-maxage=300');
    try {
      const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${encodeURIComponent(token)}`;
      const response = await fetchImpl(url, {signal: AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error('instagram_failed');
      // Media URLs from Instagram expire; keep the shared cache short.
      return reply(200, {configured: true, posts: shapePosts(await response.json())}, 'public, max-age=0, s-maxage=600, stale-while-revalidate=600');
    } catch {
      return reply(200, {configured: true, posts: [], stale: true}, 'public, max-age=0, s-maxage=60');
    }
  };
}
