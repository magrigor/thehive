import rTracer from 'cls-rtracer';
import debug from 'debug';
import { Maybe } from 'true-myth';

type Level = 'debug' | 'info' | 'warn' | 'error';
type Payload = Record<string, unknown>;

export type Logger = (level: Level, message: string, payload?: Payload) => void;

export const createRTracerLogger = (logger: Logger): Logger => {
  const withRequestId = (payload: Payload): Payload => (
    Maybe.of(rTracer.id()).mapOr(
      payload,
      (requestId) => ({ ...payload, requestId }),
    )
  );

  return (level, message, payload = {}) => (
    logger(level, message, withRequestId(payload))
  );
};

export const createDebugLogger = (prettyPrint: boolean): Logger => (
  (level, message, payload = {}) => {
    debug.log(JSON.stringify({
      timestamp: new Date(), level, message, payload,
    }, undefined, prettyPrint ? 2 : undefined));
  }
);