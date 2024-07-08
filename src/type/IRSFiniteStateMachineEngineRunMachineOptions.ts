import { Action } from 'redux';

export interface IRSFiniteStateMachineEngineRunMachineOptions<RunProps = {}> {
    cancelSelector?: string | ((action: Action) => boolean)
    mapActionToProps?: (action: Action) => RunProps
}
