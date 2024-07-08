import { IRSFiniteStateMachineProps } from './type/IRSFiniteStateMachineProps';
import { CallEffect, CancelledEffect, call, cancelled, select } from 'redux-saga/effects';
import { TRSStateActionFunction } from './type/TRSStateActionFunction';

export class RSFiniteStateMachine<
    ERSFiniteStateMachineState extends string | number | symbol = string,
    ReduxStoreState = undefined,
    RunProps = {}
> {
    private props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps>;

    constructor(props: IRSFiniteStateMachineProps<ERSFiniteStateMachineState, ReduxStoreState, RunProps>) {
        this.props = props;
    }

    createSaga() {
        const self = this;
        let lastState: ERSFiniteStateMachineState;
        const stateChange = function* (runProps: RunProps) {
            try {
                let state: ERSFiniteStateMachineState = self.props.stateSelector
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

                const currentStateActions: TRSStateActionFunction<RunProps> =
                    self.props.states[state];

                if (!currentStateActions) {
                    throw new Error('RSFiniteStateMachine Error: there are no actions for state "' + String(state)) + '"';
                }

                if (lastState === state) {
                    throw new Error(`RSFiniteStateMachine Error: the same state "${String(lastState)}" called twice  in a row`);
                } else {
                    lastState = state;
                }

                yield call(currentStateActions, runProps);
            } catch (e) {
                if (self.props.handleError) {
                    yield call(self.props.handleError, e, runProps);
                } else {
                    return e;
                }
            }
        };

        return function* (runProps: RunProps) {
            let error = null;
            try {
                while (!error) {
                    error = (yield call(stateChange, runProps)) as (Error | void);
                }
            } finally {
                const isCancelled: boolean = yield cancelled();

                if (isCancelled && self.props.handleCancelled) {
                    yield call(self.props.handleCancelled, runProps);
                } else if (error) {
                    throw error;
                }
            }
        };
    }
}
