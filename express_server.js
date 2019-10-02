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
  

const users = { 
  "a000": {
    id: "a000", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "a001": {
    id: "a001", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


const urlDatabase = {
  "b2xVn2": "www.lighthouselabs.ca",
  "9sm5xK": "www.google.com",
};


app.get('/urls', (req, res) => {
  const userId = req.cookies['user_Id'];
  let templateVars =  { urls: urlDatabase, email: '' } ;
  if (users[userId]) {
  templateVars.email = users[userId].email 
  }

    
    res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userId = req.cookies['user_Id'];
  let templateVars =  { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], email: '' } ;
  if (users[userId]) {
  templateVars.email = users[userId].email 
  }
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
  res.render('urls_show', templateVars)

})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
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
  res.redirect(`/urls/${req.params.shortURL}`)
});
app.post('/urls/:shortURL/edit', (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = longURL
  res.redirect(`/urls`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = 'http://' + urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const userId = req.cookies['user_Id'];
  let templateVars =  { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], email: '' } ;
  if (users[userId]) {
  templateVars.email = users[userId].email 
  }
  res.render('urls_login', templateVars)
})
app.post("/login", (req, res) => {
  const { email, password } = req.body
  for (let client in users) {
    const userClient = users[client]
    if (userClient.email === email && userClient.password === password) {
      res.cookie('user_Id', userClient.id)
      return res.redirect('/urls')
    }
  }
    return res.redirect(`/login`)
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_Id')
  res.redirect('/urls')
});


app.get("/register", (req, res) => {
 let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], email: users[req.body.email] }
  res.render('urls_register', templateVars)
});
const userExists = function(email) {
for (const userId in users) {
  const currentUser = users[userId]
  if(currentUser.email === email) {
    return true
  }
}
return false
}
app.post("/register", (req, res) => {
  let { id, email, password} = req.body
  id = 'a' + Math.floor(Math.random() * 1000)
  if(userExists(email) === false && email !== '' && password !== '') {
  users[id] = {id, email, password}
  res.cookie('user_Id', users[id].id)
  res.redirect('/urls')
  } else {
    res.send(400)
  }
});





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});