import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import userData from '../testData/userData';
import roleData from '../testData/roleData';

const { superadmin, admin, author } = userData;
const { role5, role6, role7, role8 } = roleData;

let authorToken, adminToken, superadminToken;

const expect = chai.expect;
chai.use(chaiHttp);

describe('Roles', () => {
  before((done) => {
    chai.request(server)
      .post('/users/login')
      .send(superadmin)
      .end((err, res) => {
        superadminToken = res.body.token;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post('/users/login')
      .send(admin)
      .end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post('/users/login')
      .send(author)
      .end((err, res) => {
        authorToken = res.body.token;
        done();
      });
  });

  // GET /roles
  describe('GET /roles', () => {
    it('should allow superadmin to view roles available', (done) => {
      chai.request(server)
        .get('/roles')
        .set('x-access-token', superadminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array').that.have.lengthOf(5);
          expect(res.body[0]).to.have
            .keys('id', 'title', 'createdAt', 'updatedAt');
          done();
        });
    });

    it('should deny access when others try to view roles', (done) => {
      chai.request(server)
        .get('/roles')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object').that.have.keys('message');
          expect(res.body.message).to
            .equal('Access denied: SuperAdmin credentials required');
          done();
        });
    });
  });

  // POST /roles
  describe('POST /roles', () => {
    it('should allow a superadmin to create a new role', (done) => {
      chai.request(server)
        .post('/roles')
        .set('x-access-token', superadminToken)
        .send(role6)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.keys('message', 'role');
          expect(res.body.role).to.be.an('object').that.have
            .keys('id', 'title', 'createdAt', 'updatedAt');
          expect(res.body.message).to.equal('New role successfully created');
          role6.id = res.body.role.id;
          done();
        });
    });

    it('should fail if role already exists', (done) => {
      chai.request(server)
        .post('/roles')
        .set({ 'x-access-token': superadminToken })
        .send(role7)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors[0].message).to.equal('title must be unique');
          done();
        });
    });

    it('should deny access if user is not superadmin', (done) => {
      chai.request(server)
        .post('/roles')
        .set({ 'x-access-token': authorToken })
        .send(role8)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal('Access denied: SuperAdmin credentials required');
          done();
        });
    });
  });

  // DELETE /roles/:id
  describe('DELETE /roles/:id', () => {
    it('should allow superadmin to delete a role', (done) => {
      chai.request(server)
      .delete(`/roles/${role6.id}`)
      .set({ 'x-access-token': superadminToken })
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
    });

    it('should not delete role if user is not superadmin', (done) => {
      chai.request(server)
      .delete('/roles/4')
      .set({ 'x-access-token': adminToken })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to
          .equal('Access denied: SuperAdmin credentials required');
        done();
      });
    });

    it('should return "Role not found" for invalid id', (done) => {
      chai.request(server)
        .delete('/roles/250')
        .set({ 'x-access-token': superadminToken })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('should fail if the provided id is out of range', (done) => {
      chai.request(server)
        .delete('/roles/3000000000')
        .set({ 'x-access-token': superadminToken })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql(
            'value "3000000000" is out of range for type integer'
          );
          done();
        });
    });
  });
});