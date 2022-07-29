import { BullExplorer } from '../bull.explorer';
import { Module } from '@nestjs/core/injector/module';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IS_CUSTOM_MODULE } from '../decorators/custom-worker-module.decorator';

export function GetCustomWorkerModuleUtils(
  bullExplorer: BullExplorer,
  moduleClass: any,
) {
  const providers = bullExplorer.getProviders();

  const findOptions: { module: Module; wrapper: InstanceWrapper } = {
    module: undefined,
    wrapper: undefined,
  };

  providers.every((wrapper) => {
    const provider =
      !wrapper.metatype || wrapper.inject
        ? wrapper.instance?.constructor
        : wrapper.metatype;
    if (provider) {
      const isCustom = Reflect.getMetadata(IS_CUSTOM_MODULE, provider);
      if (isCustom && moduleClass === provider) {
        findOptions.module = wrapper.host;
        findOptions.wrapper = wrapper;
        return false;
      }
    }
    return true;
  });

  return findOptions;
}
