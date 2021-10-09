import User from "../models/User";
import bcrypt, { compare } from "bcrypt";
import fetch from "node-fetch";
import { token } from "morgan";
import { restart } from "nodemon";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Create Account",
      errorMessage: "Password Confirmation doesn't match",
    });
  }
  const existsDuplicated = await User.exists({
    $or: [{ username }, { email }],
  });
  if (existsDuplicated) {
    return res.status(400).render("join", {
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
    return res.status(400).render("join", {
      pageTitle: "Create Account",
      errorMessage: error._message,
    });
  }
};
export const getEdit = (req, res) => {
  res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, email: prevEmail, username: prevUserName, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  if (prevEmail !== email || prevUserName !== username) {
    try {
      const exists = await User.exists({
        $or: [{ username }, { email }],
      });

      if (exists) {
        return res.status(400).render("edit-profile", {
          pageTitle: "edit profile",
          errorMessage: "userName or email is already in use",
        });
      }
    } catch (e) {
      res.redirect("/");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  res.render("edit-profile", { pageTitle: "Edit profile" });
};
export const remove = (req, res) => res.send("remove user");
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
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
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        socialOnly: true,
        password: "",
        location: userData.location,
        avatarUrl: userData.avatar_url,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  req.flash("info", "Bye!");
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password");
    return res.redirect("/");
  }
  return res.render("users/change-password", {
    pageTitle: "change password",
  });
};
export const postChangePassword = (req, res) => {
  return res.redirect("/");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404");
  }
  return res.render("users/profile", {
    pageTitle: `${user.name}\'s profile`,
    user,
  });
};
