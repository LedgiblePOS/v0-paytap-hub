
import { RateLimiter } from 'limiter';

type Interval = string | number;

interface RateLimiterOptions {
  tokensPerInterval: number;
  interval: Interval;
  fireImmediately: boolean;
}

interface NextRequest {
  ip?: string;
}

interface NextResponse {
  status: number;
  headers: Record<string, string>;
  body?: string;
}

const rateLimiters = new Map<string, RateLimiter>();

const getRateLimiter = (options: RateLimiterOptions): RateLimiter => {
  const identifier = `${options.tokensPerInterval}-${options.interval}`;

  if (rateLimiters.has(identifier)) {
    return rateLimiters.get(identifier)!;
  }

  const limiter = new RateLimiter({
    tokensPerInterval: options.tokensPerInterval,
    interval: options.interval,
    fireImmediately: options.fireImmediately,
  });

  rateLimiters.set(identifier, limiter);
  return limiter;
};

export const securityMiddleware = async (
  req: NextRequest, 
  res: NextResponse, 
  options: RateLimiterOptions, 
  callback: (req: NextRequest, res: NextResponse) => Promise<NextResponse>
): Promise<NextResponse> => {
  const ip = req.ip ?? '127.0.0.1';
  const limiter = getRateLimiter(options);

  try {
    // Check if remaining tokens are available
    const remainingTokens = await limiter.removeTokens(1);
    const allowed = remainingTokens >= 0;

    if (!allowed) {
      console.warn(`Rate limit exceeded for IP ${ip}`);
      return createNextResponse(
        JSON.stringify({ message: 'Too many requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return callback(req, res);
  } catch (error) {
    console.error('Rate limiting error:', error);
    return createNextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Helper to create response object without next/server dependency
function createNextResponse(body: string, init: { status: number; headers: Record<string, string> }): NextResponse {
  return {
    status: init.status,
    headers: init.headers,
    body
  } as NextResponse;
}
