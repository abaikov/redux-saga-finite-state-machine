import { TRSSagaIterator } from './TRSSagaIterator';

export type TRSStateActionFunction<RunProps = undefined> = (runProps?: RunProps) => TRSSagaIterator<void>
