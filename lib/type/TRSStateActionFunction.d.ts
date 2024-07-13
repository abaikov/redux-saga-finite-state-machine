import { TRSSagaIterator } from './TRSSagaIterator';
export type TRSStateActionFunction<RunProps = {}, StartProps = {}> = (runProps: RunProps, startProps?: StartProps) => TRSSagaIterator<void>;
//# sourceMappingURL=TRSStateActionFunction.d.ts.map