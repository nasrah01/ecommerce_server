const allowedOrigins = [
  "https://grand-lokum-45486f.netlify.app/",
  "http://localhost:3500",
  "http://localhost:3000",
];

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export default credentials;
