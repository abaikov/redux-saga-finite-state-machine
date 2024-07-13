import { IRSFiniteStateMachineProps } from './type/IRSFiniteStateMachineProps';
import { CallEffect, CancelledEffect, call, cancelled, select } from 'redux-saga/effects';
import { TRSStateActionFunction } from './type/TRSStateActionFunction';

export class RSFiniteStateMachine<
    ERSFiniteStateMachineState extends string | number | symbol = string,
    ReduxStoreState = undefined,
    RunProps = {},
    StartProps = {},
> {
    private props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps, StartProps>;

    constructor(props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps, StartProps>) {
        this.props = props;
    }

    createSaga() {
        const self = this;

        return function* (runProps: RunProps) {
            let error = null;
            try {
                let lastState: ERSFiniteStateMachineState;
                let stateCount = 0;
                let startProps: StartProps = self.props.onStart 
                    ? yield call(self.props.onStart, runProps) 
                    : undefined;
                while (!error) {
                    error = (yield call(function* (runProps: RunProps) {
                        try {
                            let state: ERSFiniteStateMachineState | undefined = self.props.stateSelector
                                ? yield select(
                                    (reduxStoreState: ReduxStoreState) => self.props.stateSelector?.(
                                        reduxStoreState,
                                        runProps
                                    )
                                )
                                : undefined;

                            if (!state) {
                                if (self.props.defaultState) {
                                    state = typeof (self.props.defaultState) == 'function'
                                        ? self.props.defaultState()
                                        : self.props.defaultState;
                                } else {
                                    throw new Error('RSFiniteStateMachine Error: undefined state passed to the state machine');
                                }
                            }

                            const currentStateActions: TRSStateActionFunction<RunProps, StartProps> =
                                self.props.states[state];

                            if (!currentStateActions) {
                                throw new Error('RSFiniteStateMachine Error: there are no actions for state "' + String(state)) + '"';
                            }

                            if (lastState === state) {
                                if (process.env.NODE_ENV !== 'production' && stateCount > 100) {
                                    console.warn(
                                        'RSFiniteStateMachine detected an infinite cycle on the "' +
                                        String(lastState) + 
                                        '" state. Probably you forgot to ad something like `yield take(MY_ACTION)` or to change state.' +
                                        'Also hot reloading can cause this warning, it will not appear in the production mode.'
                                    );
                                    stateCount = 0;
                                }
                                // throw new Error(`RSFiniteStateMachine Error: the same state "${String(lastState)}" called twice  in a row`);
                            } else {
                                lastState = state;
                                stateCount = 0;
                            }

                            yield call(currentStateActions, runProps, startProps);
                        } catch (e) {
                            if (self.props.handleError) {
                                yield call(self.props.handleError, e, runProps);
                            } else {
                                return e;
                            }
                        }
                    }, runProps)) as (Error | void);
                }
            } finally {
                const isCancelled: boolean = yield cancelled();

                if (isCancelled && self.props.onStop) {
                    yield call(self.props.onStop, runProps);
                } else if (error) {
                    throw error;
                }
            }
        };
    }
}
