import { server, request } from "../../lib/core.mjs"

const users = []

export const myRoutes = (router) => {
    // returns all the accepted methods
    router.options("/users", (_, response) => {
        return response.status(200).json([
            "get",
            "post",
            "patch",
        ])
    })

    // gets all the users
    router.get("/users", (_, response) => {
        return response.status(200).json(users)
    }) 

    // creates a user
    router.post("/users", (request, response) => {
        if(!request.body.name) {
            return response.status(400).json(false)
        }
        
        users.push({ name: request.body.name })

        return response.status(201).json(true)
    })

    // updates a user field
    router.patch("/users/:id", (request, response) => {
        if(request.params.id === undefined || request.params.id === null) {
            return response.status(400).json({
                error: "no id specified"
            })
        }

        const userId = request.params.id
        const user = users[userId]

        if(!user) {
            return response.status(404).json({
                error: "user not found!"
            })
        };

        user[request.body.field] = request.body.value

        return response.status(200).json(true)
    })
}

server(myRoutes)
    .afterStart((close) => {
        console.log("=========================")
        console.log("Requesting the application")
        console.log("=========================")

        request.options("/users")
        request.post("/users", {
            body: {
                name: "vitor2"
            }
        })
        request.get("/users")
        request.patch("/users/:id", {
            params: {
                id: 0
            },
            body: {
                field: "name",
                value: "vitor gouveia"
            }
        })
        request.get("/users")

        console.log("=========================")
        console.log("Closing the application")
        console.log("=========================")
        close()
    })