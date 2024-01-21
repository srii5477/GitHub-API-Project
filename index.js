import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
// import btoa from "btoa";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const placeholder_st = [{
  name: 'Online-Frontend-Editor',
}, {
  name: 'Chat-Messenger-App',
}, {
  name: 'Pygame-Projects',
}];

const list = [{
  name: 'xyz',
}, {
  name: 'abc',
}, {
  name: 'pqr'
}

];

app.get("/", async (req, res) => {
    try {
      const response = await axios.get("https://api.github.com/users/srii5477");
      const result = response.data;
    //   console.log(result);
      res.render("index.ejs", { user: result, starred: placeholder_st, repos: list });
    } catch (error) {
      console.error("Failed to make request:  ", error.message);
      res.render("index.ejs", {
        error: error.message,
      });
    }
});

app.post("/", async (req, res) => {
    try {
        const response = await axios.get("https://api.github.com/users/" + req.body.search);
        const response_ = await axios.get("https://api.github.com/users/" + req.body.search + "/starred?per_page=50");
        // https://api.github.com/users/name/starred?per_page=100
        const repo_list = await axios.get("https://api.github.com/users/" + req.body.search + "/repos?per_page=50");
        const result = response.data;
        const result_ = response_.data;
        const repo_result = repo_list.data;
        // console.log(result_);
        res.render("index.ejs", { user: result, starred: result_, repos: repo_result });
    } catch (error) {
        console.error("Failed to make request: ", error.message);
        res.render("index.ejs", {
            error: error.message
        });
    }
})

// replace this with your own token
const PAID = "";

const config = {
    headers: { Authorization: `Bearer ${PAID}` },
};


app.post("/create", async (req, res) => {
    try {
      const body = {
        name : req.body.repo,
        description : req.body.desc,
        visibility : req.body.visibility || "public",
      }
        const response = await axios.post("https://api.github.com/user/repos", body, config);
        const result = response.data;
        console.log(result);
        res.render("index.ejs", { new_repo: result });
    } catch (error) {
        console.error("Failed to make request: ", error.message);
        res.render("index.ejs", {
            error: error.message
        });
    }

})

app.post("/update", async (req, res) => {
  try {
    const body = {
      name : req.body.repo,
      description : req.body.desc,
      visibility : req.body.visibility || "public",
    }
    const response = await axios.patch("https://api.github.com/repos/" + req.body.username + "/" + req.body.repo, body, config);
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { updated_repo: result });
  } catch(error) {
        console.error("Failed to make request: ", error.message);
        res.render("index.ejs", {
            error: error.message
        });
  }
})

app.post("/read", async (req, res) => {
  try {
    // config.headers.Accept = "application/vnd.github.v3.raw";
    const response = await axios.get("https://api.github.com/repos/" + req.body.username + "/" + req.body.repo + "/contents/" + req.body.path, config);
    const result = response.data;
    // console.log(result);
    let content = result.content;
    let buffer = new Buffer.from(content, 'base64');
    content = buffer.toString('ascii');
    res.render("index.ejs", { read_repo: result, content: content });
  } catch(error) {
        console.error("Failed to make request: ", error.message);
        res.render("index.ejs", {
            error: error.message
        });
  }
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
})