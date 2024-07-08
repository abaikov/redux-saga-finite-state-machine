import { SagaIterator } from 'redux-saga';
import { TRSStateActionFunction } from './TRSStateActionFunction';
export interface IRSFiniteStateMachineProps<ERSFiniteStateMachineState extends string | number | symbol = string, ReduxStoreState = undefined, RunProps = {}> {
    defaultState?: ERSFiniteStateMachineState | (() => ERSFiniteStateMachineState);
    stateSelector?: (storeState: ReduxStoreState, props: RunProps) => ERSFiniteStateMachineState;
    states: {
        [state in ERSFiniteStateMachineState]: TRSStateActionFunction<RunProps>;
    };
    handleCancelled?: (runProps: RunProps) => SagaIterator<void> | Promise<void> | void;
    handleError?: (error: Error | any, runProps?: RunProps) => SagaIterator<void> | Promise<void> | void;
}
//# sourceMappingURL=IRSFiniteStateMachineProps.d.ts.map