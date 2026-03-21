import type { APIEvent } from "@solidjs/start/server";

type AssetConfig = {
  base: number;
  variance: number;
};

const assets: Record<string, AssetConfig> = {
  Bitcoin:  { base: 95000, variance: 10  },
  Sui:      { base: 1,     variance: 0.01  },
  Ethereum: { base: 2000,  variance: 10  },
};

const randomPrice = ({ base, variance }: AssetConfig) =>
  base + (Math.random() * 2 - 1) * variance; // ✅ +/- variance, not just +

export async function GET({ request }: APIEvent) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const interval = setInterval(() => {
        const prices = Object.fromEntries(
          Object.entries(assets).map(([name, config]) => [
            name,
            randomPrice(config),
          ])
        );

        send({ prices, timestamp: Date.now() });
      }, 250);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}