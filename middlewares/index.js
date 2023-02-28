const validation = require('./validation');
const controllerWrapper = require('./controllerWrapper');
const isValidId = require('./isValidId');
const authMiddleware = require('./authMiddleware');
const uploadMiddleware = require('./uploadMiddleware');
const resizeXandYbyJimpMiddleware = require('./resizeXandYbyJimpMiddleware');
const passport = require('./googleLogin');

module.exports = {
  validation,
  controllerWrapper,
  isValidId,
  authMiddleware,
  uploadMiddleware,
  resizeXandYbyJimpMiddleware,
  passport,
};
