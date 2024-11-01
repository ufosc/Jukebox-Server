# How the Track Queue Works

When the current track is over...

1. If the queue is empty, do nothing. Spotify will play next song in their queue.
2. If the queue is not empty, pop the next track from queue, set to current track.

## FAQ

**Q: How do we know when the track is over?**

A: We can only know if one of the admins is playing spotify through the web player, if that is the case the frontend will update the backend via a websocket
