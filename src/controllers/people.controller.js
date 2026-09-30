import * as peopleService from '../services/people.service.js'

export const getFeaturedPeople = async (
    req,
    res,
    next
) => {
    try {
        const people =
            await peopleService.getFeaturedPeople()

        return res.status(200).json({
            people,
        })
    } catch (error) {
        next(error)
    }
}