const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(cookieParser())
function generateRandomString() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({extended: true}));
  
const urlDatabase = {
  "b2xVn2": "www.lighthouselabs.ca",
  "9sm5xK": "www.google.com",
};

app.get('/urls', (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]}
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]}
  res.render('urls_show', templateVars)

})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`)
  res.send(shortURL)
  res.status(200).send();
});
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
});
app.get('/urls/:shortURL/edit', (req, res) => {
  console.log(urlDatabase[req.param.shortURL])
  res.redirect(`/urls/${req.params.shortURL}`)
});
app.post('/urls/:shortURL/edit', (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = longURL
  res.redirect(`/urls`);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = 'http://' + urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect(`/urls`)
})

app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username)
  res.redirect('/urls')
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});