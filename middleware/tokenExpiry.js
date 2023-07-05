export const checkTokenExpiry = (req, res, next) => {
    const token = req.headers.authorization;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (decodedToken.exp < Date.now() / 1000) {
        return res.StatusCodes.OK.json("Your Token Has Expired, please Login ");
      }
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };