import Category from "../models/category";

const findOrCreateCategory = async (categoryName: string) => {
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
        category = await Category.create({ name: categoryName });
    }
    return category;
};

export default findOrCreateCategory;
