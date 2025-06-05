const roleAuthenticate = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (permissions.includes(userRole)) {
      console.log(`${req.user.firstName} can pass this route`);
      next();
    } else {
      return res
        .status(401)
        .json({ message: "You do not have permission to access this route" });
    }
  };
};

module.exports = roleAuthenticate;
