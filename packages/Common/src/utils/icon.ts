import { siArtstation, siBehance, siBluesky, siDeviantart, siDiscord, siFacebook, siFlickr, siGithub, siInstagram, siKakaotalk, siKickstarter, siKofi, siLine, siMastodon, siMedium, siMisskey, siNiconico, siPatreon, siPinterest, siPixiv, siReddit, siSinaweibo, siSteam, siTelegram, siThreads, siTiktok, siTistory, siTumblr, siTwitch, siVimeo, siX, siYoutube, type SimpleIcon } from "simple-icons";

const hostIconMap: { [key: string]: SimpleIcon } = {
  // Twitter / X
  "twitter.com": siX,
  "x.com": siX,
  // GitHub
  "github.com": siGithub,
  // YouTube
  "youtube.com": siYoutube,
  "youtu.be": siYoutube,
  // Vimeo
  "vimeo.com": siVimeo,
  // Twitch
  "twitch.tv": siTwitch,
  // TikTok
  "tiktok.com": siTiktok,
  // Instagram
  "instagram.com": siInstagram,
  // Facebook
  "facebook.com": siFacebook,
  // Threads
  "threads.net": siThreads,
  // Pixiv
  "pixiv.net": siPixiv,
  // niconico
  "nicovideo.jp": siNiconico,
  "seiga.nicovideo.jp": siNiconico,
  "sp.nicovideo.jp": siNiconico,
  "sp.seiga.nicovideo.jp": siNiconico,
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
  // Tistory
  "tistory.com": siTistory,
  // ArtStation
  "artstation.com": siArtstation,
  // DeviantArt
  "deviantart.com": siDeviantart,
  // Flickr
  "flickr.com": siFlickr,
  // Discord
  "discord.com": siDiscord,
  "discord.gg": siDiscord,
  // KakaoTalk
  "kakao.com": siKakaotalk,
  "qr.kakao.com": siKakaotalk,
  "qr.kakaopay.com": siKakaotalk,
  // Telegram
  "telegram.org": siTelegram,
  "t.me": siTelegram,
  // LINE
  "line.me": siLine,
  "lin.ee": siLine,
  // Steam
  "steampowered.com": siSteam,
  "steamcommunity.com": siSteam,
  // Kickstarter
  "kickstarter.com": siKickstarter,
  // Ko-fi
  "ko-fi.com": siKofi,
  // Patreon
  "patreon.com": siPatreon,
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
