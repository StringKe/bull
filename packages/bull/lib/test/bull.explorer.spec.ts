import { getQueueToken } from '@stringke/bull-shared';
import { DiscoveryModule } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Test, TestingModule } from '@nestjs/testing';
import { BullMetadataAccessor } from '../bull-metadata.accessor';
import { BullExplorer } from '../bull.explorer';
import { BullModule } from '../bull.module';

describe('BullExplorer', () => {
  let bullExplorer: BullExplorer;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [BullExplorer, BullMetadataAccessor],
    }).compile();

    bullExplorer = moduleRef.get(BullExplorer);
  });
  afterAll(async () => {
    await moduleRef.close();
  });
  describe('handleProcessor', () => {
    it('should add the given function to the queue handlers', () => {
      const instance = { handler: jest.fn() };
      const queue = { process: jest.fn() } as any;
      bullExplorer.handleProcessor(instance, 'handler', queue, null, false);
      expect(queue.process).toHaveBeenCalledWith(expect.any(Function));
    });
    it('should add the given function to the queue handlers with concurrency', () => {
      const instance = { handler: jest.fn() };
      const queue = { process: jest.fn() } as any;
      const opts = { concurrency: 42 };
      bullExplorer.handleProcessor(
        instance,
        'handler',
        queue,
        null,
        false,
        opts,
      );
      expect(queue.process).toHaveBeenCalledWith(
        opts.concurrency,
        expect.any(Function),
      );
    });
    it('should add the given function to the queue handlers with concurrency with a 0 value', () => {
      const instance = { handler: jest.fn() };
      const queue = { process: jest.fn() } as any;
      const opts = { concurrency: 0 };
      bullExplorer.handleProcessor(
        instance,
        'handler',
        queue,
        null,
        false,
        opts,
      );
      expect(queue.process).toHaveBeenCalledWith(
        opts.concurrency,
        expect.any(Function),
      );
    });
    it('should add the given function to the queue handlers with name', () => {
      const instance = { handler: jest.fn() };
      const queue = { process: jest.fn() } as any;
      const opts = { name: 'test' };
      bullExplorer.handleProcessor(
        instance,
        'handler',
        queue,
        null,
        false,
        opts,
      );
      expect(queue.process).toHaveBeenCalledWith(
        opts.name,
        expect.any(Function),
      );
    });
    it('should add the given function to the queue handlers with concurrency and name', () => {
      const instance = { handler: jest.fn() };
      const queue = { process: jest.fn() } as any;
      const opts = { name: 'test', concurrency: 42 };

      bullExplorer.handleProcessor(
        instance,
        'handler',
        queue,
        null,
        false,
        opts,
      );
      expect(queue.process).toHaveBeenCalledWith(
        opts.name,
        opts.concurrency,
        expect.any(Function),
      );
    });
  });

  describe('handleListener', () => {
    it('should add the given function to the queue listeners for the given event', () => {
      const instance = { handler: jest.fn() };
      const queue = { on: jest.fn() } as any;
      const opts = { eventName: 'test' } as any;
      const wrapper = new InstanceWrapper();
      bullExplorer.handleListener(instance, 'handler', wrapper, queue, opts);
      expect(queue.on).toHaveBeenCalledWith(
        opts.eventName,
        expect.any(Function),
      );
    });
  });

  describe('getQueue', () => {
    it('should return the queue matching the given token', async () => {
      const queueToken = getQueueToken('test');
      const fakeQueue = 'I am a fake queue';

      const moduleRef = await Test.createTestingModule({
        imports: [BullModule.registerQueue({ name: 'test' })],
      })
        .overrideProvider(queueToken)
        .useValue(fakeQueue)
        .compile();

      const explorer = moduleRef.get(BullExplorer);

      const queue = explorer.getQueue(queueToken, 'test');
      expect(queue).toBeDefined();
      expect(queue).toBe(fakeQueue);

      await moduleRef.close();
    });
  });
});
