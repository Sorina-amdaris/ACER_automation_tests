export const API_BASE_URL =
  process.env.ACER_API_BASE_URL ??
  'https://acer-spo-api-fkb0bhbshngtb6g4.polandcentral-01.azurewebsites.net/api';

export const BEARER_TOKEN = process.env.ACER_BEARER_TOKEN;
export const API_AUDIENCE = process.env.ACER_API_AUDIENCE;

function decodeJwtPayload(token: string): Record<string, unknown> | undefined {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return undefined;
    }

    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export const EFFECTIVE_BEARER_TOKEN = BEARER_TOKEN;

export const TOKEN_SOURCE = BEARER_TOKEN
  ? 'env.ACER_BEARER_TOKEN'
  : 'none';

export const TOKEN_AUDIENCE = EFFECTIVE_BEARER_TOKEN
  ? (decodeJwtPayload(EFFECTIVE_BEARER_TOKEN)?.aud as string | undefined)
  : undefined;

export function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (EFFECTIVE_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${EFFECTIVE_BEARER_TOKEN}`;
  }

  return headers;
}
