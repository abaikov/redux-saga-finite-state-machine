import { IRSFiniteStateMachineProps } from './type/IRSFiniteStateMachineProps';
import { CallEffect, CancelledEffect } from 'redux-saga/effects';
export declare class RSFiniteStateMachine<ERSFiniteStateMachineState extends string | number | symbol = string, ReduxStoreState = undefined, RunProps = {}, StartProps = {}> {
    private props;
    constructor(props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps, StartProps>);
    createSaga(): (runProps: RunProps) => Generator<CancelledEffect | CallEffect<unknown>, void, StartProps & (void | Error) & boolean>;
}
//# sourceMappingURL=RSFiniteStateMachine.d.ts.map