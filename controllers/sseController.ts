import { Request, Response } from "express";

const SEND_INTERVAL = 2000;

const writeEvent = (res: Response, sseId: string, data: string) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

export const sendEvent = (
  _req: Request,
  res: Response,
  data: Record<string, any>
) => {
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const sseId = new Date().toDateString();

  setInterval(() => {
    writeEvent(res, sseId, JSON.stringify(data));
  }, SEND_INTERVAL);

  writeEvent(res, sseId, JSON.stringify(data));
};
