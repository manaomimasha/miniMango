
// crear usuario
app.post("/users", async (req, res) => {
    try {
      const user = await User.create(req.body); // {name,email,password}
      res.status(201).json({ id: user._id, email: user.email, name: user.name });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
  app.get("/users", async (req, res) => {
    try {
      //const user = await User.create(req.body); // {name,email,password}
      res.status(200).json({ user: "User get" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
  // login básico
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Credenciales inválidas" });
    res.json({ message: "login ok", userId: user._id });
  });
  
  // crear nota
  app.post("/notes", async (req, res) => {
    try {
      const { userId, title, category, content } = req.body;
      const note = await Note.create({ user: userId, title, category, content });
      res.status(201).json(note);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
  // listar notas de un usuario
  app.get("/notes/:userId", async (req, res) => {
    const notes = await Note.find({ user: req.params.userId }).sort("-createdAt");
    res.json(notes);
  });
  