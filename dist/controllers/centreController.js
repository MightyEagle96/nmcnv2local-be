export const LoginCentre = async (req, res) => {
    try {
        console.log(req.body);
        res.send("Hello");
    }
    catch (error) {
        res.status(500).send(new Error(error).message);
    }
};
//# sourceMappingURL=centreController.js.map