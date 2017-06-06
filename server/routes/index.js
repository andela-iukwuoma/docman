import controllers from '../controllers';
import authMiddlewares from '../middlewares/auth';

const userControllers = controllers.user;
const roleControllers = controllers.role;
const documentControllers = controllers.document;
const searchControllers = controllers.search;

const validateToken = authMiddlewares.validateToken;
const isAdminOrSuperadmin = authMiddlewares.isAdminOrSuperadmin;

const Routes = (app) => {
  app.get('/v1', (req, res) => res.status(200).send({
    message: 'Welcome to DocMan-Pro API',
  }));

  app.route('/roles')
    .post(roleControllers.create);

  app.route('/roles/:roleId')
    .delete(roleControllers.destroy);

  app.route('/users')
    .get(validateToken, isAdminOrSuperadmin, userControllers.list)
    .post(userControllers.create);

  app.route('/users/login')
    .post(userControllers.login);

  app.route('/users/logout')
    .post(userControllers.logout);

  app.use('/users/:userId', validateToken);
  app.route('/users/:userId')
    .get(userControllers.retrieve)
    .put(userControllers.update)
    .delete(userControllers.destroy);

  app.route('/users/:userId/documents')
    .get(documentControllers.listUserDocuments);

  app.use('/documents', validateToken);
  app.route('/documents')
    .get(documentControllers.list)
    .post(documentControllers.create);

  app.route('/documents/:documentId')
    .get(documentControllers.retrieve)
    .put(documentControllers.update)
    .delete(documentControllers.destroy);

  app.route('/search/users/')
    .get(searchControllers.searchUsers);

  app.route('/search/documents')
    .get(searchControllers.searchDocuments);
};

export default Routes;