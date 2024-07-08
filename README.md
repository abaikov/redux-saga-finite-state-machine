
# Redux-Saga-Finite-State-Machine

Redux-Saga-Finite-State-Machine is a TypeScript library designed for efficient state machine management within Redux-Saga environments. It provides robust handling of application state transitions in response to asynchronous events, specifically tailored for React and Redux applications.

## Features

- Define and manage state machines using Redux-Saga.
- Handle state transitions based on Redux actions.
- Custom error and cancellation handling within state machine workflows.

## Example project
https://github.com/abaikov/rsfsm-example

## Installation

Install Redux-Saga-Finite-State-Machine using npm:

```bash
npm install redux-saga-finite-state-machine
```

Or using yarn:

```bash
yarn add redux-saga-finite-state-machine
```

## Usage without components

### Example of State Machine Definition and Usage

Here is how you can define and use a state machine in a React component:

#### Defining a State Machine

```typescript
import { RSFiniteStateMachine } from 'redux-saga-finite-state-machine';

// Define your states and transitions
const myStateMachineProps = {
    defaultState: 'idle',
    states: {
        idle: (props) => function* () { /* Logic for idle state */ },
        loading: (props) => function* () { /* Logic for loading state */ },
        success: (props) => function* () { /* Logic for success state */ }
    },
    handleError: (error, props) => function* () { console.error(error); }
};

export const myStateMachine = new RSFiniteStateMachine(myStateMachineProps);
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

sagaMiddleware.run(function*() {
    yield all([
        takeEvery(
            START_MACHINE_ACTION_TYPE, 
            RSFiniteStateMachineEngine.runStateMachine(RSFSMExampleStateMachine, {
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

#### Using the State Machine in a Component

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

- **`defaultState`**: The initial state of the machine. Can be a literal value or a function that returns the state.
- **`states`**: An object mapping each state to a generator function that executes the logic for that state.
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

Contributions are welcome! Please read our contributing guidelines before submitting pull requests to the project.

## License

Redux-Saga-Finite-State-Machine is MIT licensed. See the [LICENSE](LICENSE) file for more details.

