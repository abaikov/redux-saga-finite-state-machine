import { RSFiniteStateMachine } from './RSFiniteStateMachine';
import { eventChannel, END, Channel, Task } from 'redux-saga';
import { call, cancel, cancelled, fork, take } from 'redux-saga/effects';
import { IRSFiniteStateMachineEngineProps } from './type/IRSFiniteStateMachineEngineProps';
import { Action } from 'redux';
import { IRSFiniteStateMachineEngineRunMachineOptions } from './type/IRSFiniteStateMachineEngineRunMachineOptions';

export class RSFiniteStateMachineEngine {
    private props: IRSFiniteStateMachineEngineProps;
    private emitter: ((input: any | END) => void) | null = null

    static runStateMachine<
        ERSFiniteStateMachineState extends string | number | symbol = string,
        ReduxStoreState = undefined,
        RunProps = {}
    >(
        stateMachine: RSFiniteStateMachine<ERSFiniteStateMachineState, ReduxStoreState, RunProps>, 
        options?: IRSFiniteStateMachineEngineRunMachineOptions<RunProps>
    ) {
        return function*(action: Action) {
            const runProps: RunProps = options?.mapActionToProps ? options.mapActionToProps(action) : action as RunProps;
            const saga = stateMachine.createSaga();
            const task: Task = yield fork(
                saga,
                runProps
            );
            if (options?.cancelSelector) {
                yield take(options.cancelSelector);
                yield cancel(task);
            }
        }
    }

    constructor(props?: IRSFiniteStateMachineEngineProps) {
        this.props = props || {};
    }

    public runStateMachine<
        ERSFiniteStateMachineState extends string | number | symbol = string,
        ReduxStoreState = undefined,
        RunProps = {}
    >(
        stateMachine: RSFiniteStateMachine<ERSFiniteStateMachineState, ReduxStoreState, RunProps>,
        options?: IRSFiniteStateMachineEngineRunMachineOptions<RunProps>
    ) {
        const self = this;
        return function* (action: Action) {
            try {
                const runProps: RunProps = options?.mapActionToProps ? options.mapActionToProps(action) : action as RunProps;
                const saga = stateMachine.createSaga();
                const task: Task = yield fork(
                    saga,
                    runProps
                );
                if (options?.cancelSelector) {
                    yield take(options.cancelSelector);
                    yield cancel(task);
                }
            } catch (e) {
                if (self.props.handleError) {
                    yield call(self.props.handleError, e);
                } else {
                    throw e;
                }
            }
        }
    }

    start() {
        const self = this;
        return function* () {
            const channel: Channel<any> = yield call(self.createChannel, self);

            try {
                while (true) {
                    let { payload: {
                        task,
                        awaitForTaskCancel,
                        runProps
                    } }: { payload: any } = yield take(channel);
                    yield fork(function*() {
                        const runningTask: Task = yield fork(function*() {
                            try {
                                yield call(task, runProps);
                            } catch (e) {
                                if (self.props.handleError) {
                                    yield call(self.props.handleError, e);
                                } else {
                                    throw e;
                                }
                            }
                        });
                        yield call(awaitForTaskCancel);
                        yield cancel(runningTask);
                    });
                }
            } finally {
                const isCancelled: boolean = yield cancelled();

                if (isCancelled) {
                    channel.close();
                }
            }
        }
    }

    runMachineWithProps<
        ERSFiniteStateMachineState extends string | number | symbol = string,
        ReduxStoreState = undefined,
        RunProps = {}
    >(
        stateMachine: RSFiniteStateMachine<ERSFiniteStateMachineState, ReduxStoreState, RunProps>,
        runProps?: RunProps
    ) {
        let task = stateMachine.createSaga();
        let cancelTask: () => void = () => null;
        let cancelTaskPromise = new Promise((resolve) => {
            cancelTask = resolve as () => void;
        });
        this.emitter?.({
            payload: {
                task,
                awaitForTaskCancel: () => {
                    return cancelTaskPromise;
                },
                runProps,
            }
        });

        return cancelTask;
    }

    destroy() {
        this.emitter?.(END);
    }

    createChannel(self: RSFiniteStateMachineEngine) {
        return eventChannel(emitter => {
            self.emitter = emitter;
            return () => {

            }
        });
    }
}
