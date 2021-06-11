import User from "../models/User";

export const getJoin = (req, res) =>
    res.render("joinAccount", { pageTitle: "Create Account" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, location } = req.body;
    await User.create({
        name,
        username,
        email,
        password,
        location,
    });
    return res.redirect("/login");
};
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
