  const DEFAULT_SITE_URL = "https://www.mayaakars.com";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

