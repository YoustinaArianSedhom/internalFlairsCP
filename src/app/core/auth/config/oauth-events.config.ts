export enum OauthEventsTypes {
    tokenReceived = 'token_received',
    tokenExpires = 'token_expires',
    sessionTerminated = 'session_terminated',
    sessionError = 'session_error',
    discoveryDocumentLoadFails = 'discovery_document_load_error',
    codeError = 'code_error',
    invalidNonce = 'invalid_nonce_in_state'
}


export enum OauthFailsMessages {
    failToCommunicate = "Failed to connect with Identity Provider, Please try again later OR with different browser",
    failToAuthenticate = "Failed to authenticate current user, Please try again later Or with different browser",
    failToRefresh = "Failed to renew your session, maybe it's an internet issue or you haven't resumed your session for a long time.",
    oneOfTokensExpired = "[Auth Service] One of ID_TOKEN and ACCESS_TOKEN has been expired"
}