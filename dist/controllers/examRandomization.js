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
        // questions: randomizedQuestions,
    };
};
//# sourceMappingURL=examRandomization.js.map