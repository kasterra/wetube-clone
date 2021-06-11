import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>
    res.render("joinAccount", { pageTitle: "Create Account" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    if (password !== password2) {
        return res.status(400).render("joinAccount", {
            pageTitle: "Create Account",
            errorMessage: "Password Confirmation doesn't match",
        });
    }
    const existsDuplicated = await User.exists({
        $or: [{ username }, { email }],
    });
    if (existsDuplicated) {
        return res.status(400).render("joinAccount", {
            pageTitle: "Create Account",
            errorMessage: "This Username/Email is Already Taken",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("joinAccount", {
            pageTitle: "Create Account",
            errorMessage: error._message,
        });
    }
};
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username });
    if (!userExists) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username doesn't exists",
        });
    }
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password",
        });
    }
    return res.redirect("/");
};
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
