
# Redux-Saga-Finite-State-Machine

Redux-Saga-Finite-State-Machine is a TypeScript library designed for efficient state machine management within Redux-Saga environments.

## Features

- Define and manage state machines using Redux-Saga.
- Handle state transitions based on Redux actions.
- Custom error and cancellation handling within state machine workflows.

## Example project
https://github.com/abaikov/rsfsm-example

## Related Packages

If you are using `redux-saga-finite-state-machine`, you might also find the following related packages useful:

- **[react-redux-saga-finite-state-machine](https://www.npmjs.com/package/react-redux-saga-finite-state-machine)**: An extension of Redux Saga Finite State Machine specifically tailored for React applications. It provides additional bindings to work seamlessly with React and Redux.

## Installation

Install Redux-Saga-Finite-State-Machine using npm:

```bash
npm install redux-saga-finite-state-machine
```

Or using yarn:

```bash
yarn add redux-saga-finite-state-machine
```

## Usage

### Defining a State Machine

Here is a general implementation of a state machine, demonstrating how to handle user actions and system events:

```typescript
import { RSFiniteStateMachine } from 'redux-saga-finite-state-machine';
import { take, put } from 'redux-saga/effects';

// Define your states and transitions
const myStateMachineProps = {
    defaultState: 'idle',
    stateSelector: (myReduxStoreState, runProps) => 
        myReduxStoreState.myModule.entites[runProps.id].state, // or 'status' 
    // It will block everything until finished
    onStart: function* (runProps) {
        //Here you can init subscriptions to sockets or any other events
        //and pass the saga channel to other components as 'startProps'
        const myChannel = eventChannel(emitter => {
            // Subscribe

            // The subscriber must return an unsubscribe function
            return () => {
                //Unsubscribe
            }
        });
        const channel = yield call(myChannel, value);

        return {
            channel
        }
    },
    states: {
        idle: function* (runProps, startProps) { 
            // Logic for idle state: waiting for user to enter the page
            yield take('USER_ENTERED_PAGE_ACTION');
            // or yield take(startProps.channel);
        },
        loading: function* (runProps, startProps) { 
            try {
                // Logic for loading state: simulate data fetching or processing
                yield put({ 
                    type: 'DATA_LOADING_COMPLETED_ACTION',
                    payload: {
                        id: runProps.id
                    }
                }); // Waiting for loading to complete
                // or startProps.emitter({
                //     type: 'DATA_LOADING_COMPLETED_ACTION',
                // })
            } catch (e) {
                yield put({
                    type: 'DATA_LOADING_FAILED_ACTION',
                    payload: {
                        id: runProps.id
                    }
                }); // Handling loading failure
            }
        },
        error: function* (runProps) { 
            // Logic for error state: wait for user to attempt to load again
            yield take('RETRY_LOADING_BUTTON_CLICK_ACTION');
        }
    },
    onStop: function* (runProps, startProps) {
        // Don't forget to unsubscribe
        startProps.channel.close();
    },
    handleError: function* (error, runProps) { console.error(error); }
};

// Instantiate the state machine with the defined properties
const myStateMachine = new RSFiniteStateMachine(myStateMachineProps);
```

### Redux Toolkit Reducer Example

Here is how you can define a Redux reducer to manage the states of your state machine:

```typescript
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    currentState: 'idle'
};

const appStateReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('USER_ENTERED_PAGE_ACTION', (state) => {
            state.currentState = 'loading';
        })
        .addCase('DATA_LOADING_COMPLETED_ACTION', (state) => {
            state.currentState = 'success';
        })
        .addCase('DATA_LOADING_FAILED_ACTION', (state) => {
            state.currentState = 'error';
        })
        .addCase('RETRY_LOADING_BUTTON_CLICK_ACTION', (state) => {
            state.currentState = 'loading';
        });
});
```

### Handling Actions with State Machines

If you do not need to run the state machine from a component but react to specific Redux actions, set up your sagas like this:

```javascript
import { RSFiniteStateMachineEngine } from 'redux-saga-finite-state-machine'

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: ReduxStoreCombinedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
const stateMachineEngine = new RSFiniteStateMachineEngine();

sagaMiddleware.run(function*() {
    yield all([
        takeEvery(
            START_MACHINE_ACTION_TYPE, 
            stateMachineEngine.runStateMachine(myStateMachine, {
                cancelSelector: STOP_MACHINE_ACTION_TYPE
            })
        )
    ]);
});
```

## Usage with components

### Setting Up the Middleware and Store

To integrate Redux-Saga-Finite-State-Machine with Redux and Redux-Saga in your application, set up your store with saga middleware as follows:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { RSFiniteStateMachineEngine } from 'redux-saga-finite-state-machine';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: rootReducer, // Your combined reducer
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

// Instantiate the state machine engine
const stateMachineEngine = new RSFiniteStateMachineEngine();

sagaMiddleware.run(function*() {
    yield fork(stateMachineEngine.start());
    // or yield all([ ...myOtherSags, call(stateMachineEngine.start()) ]);
});
```

#### Using the State Machine in a сomponent

If you are using React, you might consider using the **[React Redux Saga Finite State Machine](https://www.npmjs.com/package/react-redux-saga-finite-state-machine)** package instead, which provides additional bindings specifically designed for React applications. However, here is a general approach to integrating the Redux Saga Finite State Machine in a React component:

```javascript
function MyComponent(props) {
    React.useEffect(() => {
        const stop = stateMachineEngine.runMachineWithProps(myStateMachine, props);

        // Don't forget to stop the state machine
        return () => {
            stop();
        };
    }, [props]);

    return <div>Interactive Component with State Management</div>;
}
```

## API Reference

### `IRSFiniteStateMachineProps`

This interface describes the properties required to configure a finite state machine:

- **`states`**: An object mapping each state to a generator function that executes the logic for that state.
- **`defaultState`**: Optional. The initial state of the machine. Can be a literal value or a function that returns the state.
- **`onStart`**: Optional. A blocking function called before the states generator functions.
- **`onStop`**: Optional. A blocking function called in the end.
- **`handleError`**: Optional. A function called when an error occurs within the state machine.

### `RSFiniteStateMachine`

- **constructor(props: IRSFiniteStateMachineProps)**: Initializes a new state machine with the given properties.
- **createSaga()**: Returns a saga that manages the state transitions based on the defined states.

### `RSFiniteStateMachineEngine`

- **runStateMachine(stateMachine, options)**: Runs the specified state machine in response to dispatched actions. The `options` parameter can include:
  - **`cancelSelector`**: A selector or action type that triggers cancellation of the state machine.
  - **`mapActionToProps`**: A function that maps dispatched actions to props passed to the state machine.
- **start()**: Starts listening for actions to trigger state transitions.
- **destroy()**: Cleans up any listeners and ends any running sagas.

## Contributing

Contributions are welcome!

## License

Redux-Saga-Finite-State-Machine is MIT licensed. See the [LICENSE](LICENSE) file for more details.

