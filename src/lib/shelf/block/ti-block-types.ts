import { BlockInfoProps, EmitAdaptorEvent } from '../../../_type';
import { ActionBarEmitter } from '../../../lib';

export type BlockEventInfo = Pick<BlockInfoProps, 'title' | 'name'>;

export type BlockEmitter = ActionBarEmitter & {
  (name: 'happen', payload: BlockEvent): void;
};

export type BlockEvent = EmitAdaptorEvent & {
  block: BlockEventInfo;
};
