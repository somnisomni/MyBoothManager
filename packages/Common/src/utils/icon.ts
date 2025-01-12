import { siArtstation, siBehance, siBluesky, siDeviantart, siFacebook, siFlickr, siGithub, siInstagram, siMastodon, siMedium, siMisskey, siPinterest, siPixiv, siReddit, siSinaweibo, siThreads, siTumblr, siX, type SimpleIcon } from "simple-icons";

const hostIconMap: { [key: string]: SimpleIcon } = {
  // Twitter / X
  "twitter.com": siX,
  "x.com": siX,
  // GitHub
  "github.com": siGithub,
  // Instagram
  "instagram.com": siInstagram,
  // Facebook
  "facebook.com": siFacebook,
  // Threads
  "threads.net": siThreads,
  // Pixiv
  "pixiv.net": siPixiv,
  // Reddit
  "reddit.com": siReddit,
  // Bluesky
  "bsky.app": siBluesky,
  // Misskey
  "misskey.io": siMisskey,
  "hoto.moe": siMisskey,
  "stella.place": siMisskey,
  "qdon.space": siMisskey,
  "misskey.social": siMisskey,
  // Mastodon
  "mastodon.social": siMastodon,
  "pawoo.net": siMastodon,
  "mstdn.jp": siMastodon,
  "planet.moe": siMastodon,
  "social.silicon.moe": siMastodon,
  // Weibo
  "weibo.com": siSinaweibo,
  // Pinterest
  "pinterest.com": siPinterest,
  // Behance
  "behance.net": siBehance,
  // Tumblr
  "tumblr.com": siTumblr,
  // Medium
  "medium.com": siMedium,
  // ArtStation
  "artstation.com": siArtstation,
  // DeviantArt
  "deviantart.com": siDeviantart,
  // Flickr
  "flickr.com": siFlickr,
};

export function getSimpleIconByUrl(href: string | URL): "mail" | SimpleIcon | null {
  const url = new URL(href);

  if(url.protocol === "mailto:") {
    return "mail";
  }

  const host = url.hostname.replace(/^www(\d+)?\./, "");
  if(host in hostIconMap) {
    return hostIconMap[host];
  }

  return null;
}
