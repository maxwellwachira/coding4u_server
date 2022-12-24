import { NewsletterModel } from "./newsletterModel";

interface NewsletterSubscribeData {
    email: string;
}

const subscribeToNewsletter = async ({email}: NewsletterSubscribeData) => {
    return await NewsletterModel.create({
        email,
        subscribed: true
    });
}

const findAllSubscriptions = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await NewsletterModel.findAndCountAll({
        where: {
            subscribed: true
        },
        limit,
        offset,
        order: [['id', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);

    return {
        totalCategories: count,
        totalPages,
        currentPage: page,
        categories: rows
    };
}


const findSubscriptionById = async (id: number) => {
    return await NewsletterModel.findOne({
        where: {
            id, 
        }
    });
}

const findSubscriptionByEmail = async (email: string) => {
    return await NewsletterModel.findOne({
        where: {
           email
        }
    });
}




export {
    subscribeToNewsletter,
    findAllSubscriptions,
    findSubscriptionById,
    findSubscriptionByEmail,
};