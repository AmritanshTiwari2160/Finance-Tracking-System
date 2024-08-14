const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const db = require("./db/conn");

// Add register model here
const Register = require("./models/register");
// add transaction model here
const Transaction = require("./models/transaction");

const { getMaxListeners } = require("process");
const { userInfo } = require("os");
// const exp = require("constants");

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const resources_path = path.join(__dirname, "../res");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.use(express.static(resources_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

let user = {
  name: "",
  phone: "No user found",
  email: "No user found",
  balance: 0,
  history: [],
};

app.get("/contact", (req, res) => {
  res.render("contact", {
    user: user,
    username: user.name,
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    user: user,
    username: user.name,
  });
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/", (req, res) => {
  res.render("index", {
    user: user,
    username: user.name,
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    user: user,
    username: user.name,
  });
});
app.get("/home", (req, res) => {
  res.render("home", {
    user: user,
    username: user.name,
  });
});

app.get("/transactions", (req, res) => {
  res.render("transactions", {
    user: user,
    username: user.name,
  });
});
//load the addtransaction page and read the data from that based on the form name
app.get("/addtransaction", (req, res) => {
  res.render("addtransaction", {
    user: user,
    username: user.name,
  });
});

app.get("/success", (req, res) => {
  res.render("success", {
    user: user,
    username: user.name,
  });
});

app.post("/success", async (req, res) => {
  try {
    res.render("success", {
      user: user,
      username: user.name,
    });
  } catch (err) {
    console.log(err);
    render("404error", { err: err });
  }
});

// Adding a new route for the addtransaction page
app.post("/addincome", async (req, res) => {
  /* read the data from the form and add it to the database */
  //convert balance to int and amount to int add both and put in balance
  let balance = user.balance + parseInt(req.body.amount);
  const newIncome = {
    income: true,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    description: req.body.description,
  };
  user.history.unshift(newIncome);
  user.balance = balance;
  // update the data in the database using the user object
  try {
    await Register.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          balance: user.balance,
          history: user.history,
        },
      }
    );
    res.status(201).render("success");
  } catch (err) {
    console.log(err);
  }
});

// Adding a new route to add expenses
app.post("/addexpense", async (req, res) => {
  /* read the data from the form and add it to the database */
  //convert balance to int and amount to int add both and put in balance
  let balance = user.balance - parseInt(req.body.amount);
  const transaction = new Transaction({
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    description: req.body.description,
  });

  const newExpense = {
    income: false,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    description: req.body.description,
  };
  user.history.unshift(newExpense);
  user.balance = balance;
  // update the data in the database using the user object
  try {
    await Register.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          balance: user.balance,
          history: user.history,
        },
      }
    );
    res.status(201).render("success");
  } catch (err) {
    console.log(err);
  }
});

// Adding a new route for the deltransaction page
app.get("/deltransaction", (req, res) => {
  res.render("deltransaction", {
    user: user,
    username: user.name,
  });
});

// adding a post method to update a particular record matching those values
app.post("/updttransaction", async (req, res) => {
  const index = req.body.index;
  const amount = req.body.amount;
  const category = req.body.category;
  const date = req.body.date;
  const description = req.body.description;
  let type = req.body.type;
  type = type.toLowerCase();

  if (user.history.length > index) {
    let prevAmt = 0;
    let newAmt = 0;
    if (amount.length > 0) {
      prevAmt = user.history[index].amount;
      newAmt = parseInt(amount);
      user.history[index].amount = parseInt(amount);
    }
    if (category.length > 0) {
      user.history[index].category = category;
    }
    if (date.length > 0) {
      user.history[index].date = date;
    }
    if (description.length > 0) {
      user.history[index].description = description;
    }
    if (type.length > 0) {
      if (type == "income") {
        if (user.history[index].income == false) {
          user.balance = user.balance + newAmt - prevAmt;
          console.log(user.history[index]);
        }
        user.history[index].income = true;
      } else if (type == "expense") {
        if (user.history[index].income == true) {
          user.balance = user.balance - newAmt + parseInt(prevAmt);
        }

        user.history[index].income = false;
        // console.log(user.history[index]);
      }
    }
  }
  try {
    await Register.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          balance: user.balance,
          history: user.history,
        },
      }
    );
    res.status(201).render("success");
  } catch (err) {
    console.log(err);
  }
});

// adding a post method to update a particular record matching those values
app.post("/deltransaction", async (req, res) => {
  const index = req.body.index;

  if (user.history.length > index) {
    //  write a javascript function to delete the element at index
    let arr = user.history;
    arr.splice(index, 1);
    user.history = arr;
  }
  try {
    await Register.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          history: user.history,
        },
      }
    );
    res.status(201).render("success");
  } catch (err) {
    console.log(err);
  }
});

// // adding a post method to delete a particular record matching those values
// app.post("/deltransaction", async (req, res) => {
//   try {
//     const amount = req.body.amount;
//     const category = req.body.category;
//     const date = req.body.date;
//     const description = req.body.description;
//     let income = false;
//     if(req.body.income == 'income'){
//       income = true;
//     }
//     const newHistory = user.history.filter((item) => {
//       return (
//         item.amount != amount ||
//         item.category != category ||
//         item.date != date ||
//         item.description != description ||
//         item.income != income
//       );
//     });
//     console.log(newHistory);
//     user.history = newHistory;
//     if (income == "true") {
//       user.balance = user.balance - parseInt(amount);
//     } else {
//       user.balance = user.balance + parseInt(amount);
//     }
//     await Register.findOneAndUpdate(
//       { email: user.email },
//       {
//         $set: {
//           balance: user.balance,
//           history: user.history,
//         },
//       }
//     );
//     res.status(201).render("success");
//   } catch (err) {
//     console.log(err);
//   }
// });
// Adding a new route for the updttransaction page
app.get("/updttransaction", (req, res) => {
  res.render("updttransaction", {
    user: user,
    username: user.name,
  });
});

// Adding a new route for the viewtransaction page
app.get("/viewtransaction", (req, res) => {
  // console.log(user.history);
  res.render("viewtransaction", {
    history: user.history,
    user: user,
    username: user.name,
  });
});

// Crate a post to index page
app.post("/index", (req, res) => {
  res.render("index", {
    user: user,
    username: user.name,
  });
});

// Create a post for the signup page to get the data from the user with name /register
app.post("/register", async (req, res) => {
  try {
    // get name from form
    const password = req.body.password;
    // get name from form
    const name = req.body.name;
    // get email from form
    const email = req.body.email;
    // get phone from form
    const phone = req.body.phone;
    // get transaction from form

    let passError = "",
      nameError = "",
      phoneError = "";
    if (phone.length < 10) {
      phoneError = "* Phone number must be of 10 digits";
    }
    if (name.length < 6) {
      nameError = "* Name must be of atleast 6 characters";
    }

    if (passError.length > 0 || nameError.length > 0 || phoneError.length > 0) {
      console.log("Validation error");

      res.status(400).render("login", {
        nameError,
        phoneError,
        passError,
      });
      nameError = "";
      passError = "";
      phoneError = "";
    } else {
      const registerUser = new Register({
        name: name,
        phone: phone,
        email: email,
        password: password,
        balance: 0,
        history: [],
      });
      user.name = name;
      user.phone = phone;
      user.email = email;
      user.balance = 0;
      const registered = await registerUser.save();
      res.status(201).render("home", {
        user: user,
        username: user.name,
      });
    }
  } catch (error) {
    let formError = "* Some error occurred! Enter unique data!";
    res.status(400).render("login", {
      formError,
    });
    console.log(error);
  }
});

// Create a post for the signin page to get the data from the user with name /login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    userLogin = await Register.findOne({ email: email });
    user.name = userLogin.name;
    user.balance = userLogin.balance;
    user.email = userLogin.email;
    user.phone = userLogin.phone;
    user.history = userLogin.history;

    if (password === userLogin.password) {
      // console.log(user)
      res.status(201).render("home", {
        user: user,
        username: user.name,
      });
    } else {
      res.send("Invalid Login!!!");
    }
  } catch (err) {
    res.status(400).send("Invalid Login!!");
  }
});

/* write code for error 404 page not found when following url doesn't get matched */
app.get("*", (req, res) => {
  res.render("404error", {
    errorMsg: "Oops! Page Not Found",
  });
});
app.listen(port, () => {
  console.log(`Server is running at port no. ${port}`);
});
