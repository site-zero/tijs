import { BlockInfoProps, EmitAdaptorPayload } from '../../../_type';

export type BlockEventInfo = Pick<BlockInfoProps, 'title' | 'name'>;

export type BlockEvent = EmitAdaptorPayload & {
  block: BlockEventInfo;
};
