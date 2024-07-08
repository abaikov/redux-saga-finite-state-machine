import { IRSFiniteStateMachineProps } from './type/IRSFiniteStateMachineProps';
import { CallEffect, CancelledEffect } from 'redux-saga/effects';
export declare class RSFiniteStateMachine<ERSFiniteStateMachineState extends string | number | symbol = string, ReduxStoreState = undefined, RunProps = {}> {
    private props;
    constructor(props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps>);
    createSaga(): (runProps: RunProps) => Generator<CancelledEffect | CallEffect<unknown>, void, (Error & false) | (Error & true)>;
}
//# sourceMappingURL=RSFiniteStateMachine.d.ts.map