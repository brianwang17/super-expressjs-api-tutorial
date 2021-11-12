const rootResources = {
    authRoot: '/auth',
    usersRoot: '/users'
}

const authResources = {
    authRefreshToken: `${rootResources.authRoot}/refresh-token`
}

const usersResource = { }

export const routeResources = {
    rootResource: '/',
    ...rootResources,
    ...usersResource,
    ...authResources
    
}
