import QuestionBankCategoryModel from "../models/questionBankCategoryModel.js";
import QuestionBankModel from "../models/questionBankModel.js";
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
export const randomizeQuestionBank = (questionBank) => {
    const randomizedQuestions = shuffle(questionBank.questions.map((question) => ({
        ...question,
        options: shuffle([...question.options]),
    })));
    return {
        programme: questionBank.programme,
        isTaken: false,
        dateCreated: new Date(),
        questions: randomizedQuestions || [],
    };
};
export const generateCategories = async (questionBank) => {
    // Create the master question bank first
    const rootQuestionBank = await QuestionBankModel.create(questionBank);
    const categories = [];
    for (let i = 1; i <= 10; i++) {
        const randomized = randomizeQuestionBank(questionBank);
        categories.push({
            ...randomized,
            questionBank: rootQuestionBank._id,
            questionBankCategory: i,
        });
    }
    await QuestionBankCategoryModel.insertMany(categories);
    return rootQuestionBank;
};
//# sourceMappingURL=examRandomization.js.map