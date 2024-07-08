import { SagaIterator } from 'redux-saga';

export type TRSSagaIterator<Result> = SagaIterator<Result> | Promise<Result> | Result
