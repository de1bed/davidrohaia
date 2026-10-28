import {recentVideos} from '../worker/feed.mjs';
import {createYouTubeHandler} from '../worker/youtube-handler.mjs';
import {videos,channelId} from '../scripts/content.mjs';

export default createYouTubeHandler({load:recentVideos,fallback:videos,channelId});
