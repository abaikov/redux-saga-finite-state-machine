import { TRSSagaIterator } from './TRSSagaIterator';

export type TRSStateActionFunction<RunProps = {}> = (runProps: RunProps) => TRSSagaIterator<void>
