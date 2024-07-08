import { Action } from 'redux';

export interface IRSFiniteStateMachineEngineRunMachineOptions<RunProps = undefined> {
    cancelSelector?: string | ((action: Action) => boolean)
    mapActionToProps?: (action: Action) => RunProps
}
