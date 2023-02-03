class Response {
    _status = 200
    message = ""

    constructor() {}

    status(status) {
        this._status = status

        return this
    }

    json(message) {
        this.message = JSON.stringify(message)
        
        return this
    }
}

function buildRouteHash(method = "", path = "") {
    return `${method.toUpperCase()}-${path}`
}

function executeRoute(result, fn, method) {
    if(result === null) {
        return []
    }

    const [request, response, next] = result

    const routeResult = fn(request, response, next)

    if(routeResult instanceof Response) {
        // print out the result
        console.log(`${routeResult._status} | ${method.toUpperCase()} - ${routeResult.message}`)
        return null
    }

    return [request, response, next]
}

const routeTable = {}

const defaultState = () => [
    { params: {}, body: {} },
    new Response(),
    () => {}
]

const route = (method = "") => (path = "", ...controllers) => {
    routeTable[buildRouteHash(method, path)] = controllers

    controllers
        .reduce(
            (result, fn) => {
                return executeRoute(result, fn, method)
            },
            defaultState()
        )

    return null
}

export const router = {
    post: route("post"),
    get: route("get"),
    put: route("put"),
    delete: route("delete"),
    patch: route("patch"),
    options: route("options"),
} 

export const server = (...routes) => {
    console.log("starting server...")
    routes.forEach((fn) => fn(router))

    
    return {
        afterStart: (callback) => {
            const id = setTimeout(() => callback(close), 0)
            function close() {
                clearTimeout(id)
            }
        }
    }
}

const requestRoute = (method) => (path, request) => {
    const controllers = routeTable[buildRouteHash(method, path)]
    controllers
        .reduce(
            (result, fn) => {
                return executeRoute(result, fn, method)
            },
            [
                request,
                new Response(),
                () => {}
            ]
        )
}

export const request = {
    post: requestRoute("post"),
    get: requestRoute("get"),
    put: requestRoute("put"),
    delete: requestRoute("delete"),
    patch: requestRoute("patch"),
    options: requestRoute("options"),
}