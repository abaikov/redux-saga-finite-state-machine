import { RSFiniteStateMachine } from './RSFiniteStateMachine';
import { Channel, Task } from 'redux-saga';
import { IRSFiniteStateMachineEngineProps } from './type/IRSFiniteStateMachineEngineProps';
import { Action } from 'redux';
import { IRSFiniteStateMachineEngineRunMachineOptions } from './type/IRSFiniteStateMachineEngineRunMachineOptions';
export declare class RSFiniteStateMachineEngine {
    private props;
    private emitter;
    static runStateMachine<ERSFiniteStateMachineState extends string | number | symbol = string, ReduxStoreState = undefined, RunProps = {}>(stateMachine: RSFiniteStateMachine<ERSFiniteStateMachineState, ReduxStoreState, RunProps>, options?: IRSFiniteStateMachineEngineRunMachineOptions<RunProps>): (action: Action) => Generator<import("redux-saga/effects").TakeEffect | import("redux-saga/effects").CancelEffect | import("redux-saga/effects").ForkEffect<void>, void, Task<any>>;
    constructor(props?: IRSFiniteStateMachineEngineProps);
    start(): () => Generator<import("redux-saga/effects").CancelledEffect | import("redux-saga/effects").ForkEffect<void> | import("redux-saga/effects").CallEffect<import("redux-saga").EventChannel<import("@redux-saga/types").NotUndefined>> | import("redux-saga/effects").ChannelTakeEffect<any>, never, Channel<any> & {
        payload: any;
    } & boolean>;
    runMachineWithProps<ERSFiniteStateMachineState extends string | number | symbol = string, ReduxStoreState = undefined, RunProps = {}>(stateMachine: RSFiniteStateMachine<ERSFiniteStateMachineState, ReduxStoreState, RunProps>, runProps?: RunProps): () => void;
    destroy(): void;
    createChannel(self: RSFiniteStateMachineEngine): import("redux-saga").EventChannel<import("@redux-saga/types").NotUndefined>;
}
//# sourceMappingURL=RSFiniteStateMachineEngine.d.ts.map