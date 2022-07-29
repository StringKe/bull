import { SetMetadata } from '@nestjs/common';

export const IS_CUSTOM_MODULE = 'IS_CUSTOM_QUEUE_MODULE';

export const CustomWorkerModule = () => SetMetadata(IS_CUSTOM_MODULE, true);
