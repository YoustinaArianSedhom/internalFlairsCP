import { StateClass } from "@ngxs/store/internals";
import { SpinnerState } from '@core/modules/spinner/state/spinner.state';
import { AuthState } from '@core/auth/state/auth.state';
import { AuthorizationState } from "@core/modules/authorization/state/authorization.state";
import { OrganizationState } from "@core/modules/organization/state/organization.state";
import { UserState } from "@core/modules/user/state/user.state";


export const coreStates: Array<StateClass> = [
    SpinnerState,
    AuthState,
    AuthorizationState,
    OrganizationState,
    UserState
];

export const cachedStates: Array<StateClass> = [
    UserState,
    OrganizationState,
    AuthorizationState
];

export const statesConfig: {
    coreStates: typeof coreStates;
    statesToBeCached: typeof cachedStates
} = {
    coreStates: coreStates,
    statesToBeCached: cachedStates
};

