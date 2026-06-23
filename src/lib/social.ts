interface PostResult {
  success: boolean;
  postUrl?: string;
  error?: string;
}

async function postToFacebook(accessToken: string, pageId: string, message: string, link?: string): Promise<PostResult> {
  try {
    const url = `https://graph.facebook.com/v22.0/${pageId}/feed`;
    const body: Record<string, string> = { message, access_token: accessToken };
    if (link) body.link = link;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (json.id) return { success: true, postUrl: `https://facebook.com/${pageId}/posts/${json.id}` };
    return { success: false, error: json.error?.message ?? "Facebook API error" };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

async function postToTwitter(accessToken: string, message: string, link?: string): Promise<PostResult> {
  try {
    const text = link ? `${message}\n${link}` : message;
    const res = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text }),
    });
    const json = await res.json();

    if (json.data?.id) return { success: true, postUrl: `https://twitter.com/i/web/status/${json.data.id}` };
    return { success: false, error: json.detail ?? "Twitter API error" };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function postToSocial(
  platform: string,
  accessToken: string,
  pageId: string | undefined,
  message: string,
  link?: string,
): Promise<PostResult> {
  if (platform === "facebook") {
    if (!pageId) return { success: false, error: "Page ID required for Facebook" };
    return postToFacebook(accessToken, pageId, message, link);
  }
  if (platform === "twitter") {
    return postToTwitter(accessToken, message, link);
  }
  return { success: false, error: `Unsupported platform: ${platform}` };
}
