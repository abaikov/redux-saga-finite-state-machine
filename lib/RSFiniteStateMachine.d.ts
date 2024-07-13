import { IRSFiniteStateMachineProps } from './type/IRSFiniteStateMachineProps';
import { CallEffect, CancelledEffect } from 'redux-saga/effects';
export declare class RSFiniteStateMachine<ERSFiniteStateMachineState extends string | number | symbol = string, ReduxStoreState = undefined, RunProps = {}, StartProps = {}> {
    private props;
    constructor(props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps, StartProps>);
    createSaga(): (runProps: RunProps) => Generator<CancelledEffect | CallEffect<import("redux-saga/effects").SagaReturnType<(runProps: RunProps) => import("redux-saga").SagaIterator<StartProps> | Promise<StartProps> | StartProps>> | CallEffect<void | Promise<void> | import("redux-saga").SagaIterator<void>>, void, StartProps & (void | Error) & boolean>;
}
//# sourceMappingURL=RSFiniteStateMachine.d.ts.map