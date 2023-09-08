const jwt = require('jsonwebtoken')
const rantsRouter = require('express').Router()
const Rant = require('../models/rant')
const User = require('../models/user')
const logger = require ('../utils/logger')

rantsRouter.get('/', async(request, response) => {
    const rants = await Rant.find({}) //Rant.find({'user': request.user})
    response.json(rants)
})

rantsRouter.get('/:username', async(request, response) => {
    const username = request.params.username

    const user = await User.findOne({'username': username})
    console.log(user)
    if(user !== null){
        console.log("success!")
        const rants = await Rant.find({'user': user.username})
        // console.log(rants)
        response.json(rants)
    }

})

rantsRouter.post('/', async(request, response) => {
    const body = request.body

    if(!request.token){
        return response.status(401).json({error: 'no token found'})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }

    const user = request.user
    // logger.info("USERNAME OF USER:")
    // console.log(request.user)

    const newRant = new Rant({
        content: body.content,
        date: body.date,
        likes: [],
        saves: 0,
        user: user.username.toString()
    })

    const savedRant = await newRant.save()
    user.rants = user.rants.concat(savedRant._id)
    await user.save()

    response.status(201).json(newRant)
})

// rantsRouter.delete('/:id', async(request, response) => {
//     const id = request.params.id

//     if(!request.token){
//         return response.status(401).json({error: "no token found"})
//     }

//     const decodedToken = jwt.verify(request.token, process.env.SECRET)

//     if(!decodedToken.id){
//         return response.status(401).json({error: "invalid token"})
//     }

//     const rant = await Rant.findById(id)

//     console.log(rant.user)
//     console.log(request.user)

//     if(decodedToken.id.toString() === rant.user.toString()){
//         await Rant.findByIdAndDelete(id).catch(error => next(error))

//         const user = request.user
//         user.rants = user.rants.filter(t => t.id.toString() !== id)
//         await user.save()
//     } else {
//         return response.status(401).json({error: "invalid user"})
//     }

//     response.status(204).end()
// })

/*
rantsRouter.put('/:id', async(request, response) => {
    // 1. verify editor = original author
    // 2. update User's rant list
    const body = request.body
    const id = request.params.id

    const updatedRant = {
        content: body.content,
    }

    const result = await Rant.findByIdAndUpdate(id, updatedRant, {new: true})

    response.json(result)
}) */

module.exports = rantsRouter