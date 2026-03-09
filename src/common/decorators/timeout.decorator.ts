import { SetMetadata } from '@nestjs/common';

export const TIMEOUT_KEY = 'request_timeout_ms';

export const Timeout = (ms: number) => SetMetadata(TIMEOUT_KEY, ms);
