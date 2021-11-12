import app from '../../app';
import { agent as request } from 'supertest';
import { expect } from 'chai';
import { routeResources } from '../../app/shared/routeResources/routeResources';

const { usersRoot } = routeResources;

interface SimpleUserModel {
    username: string;
    email: string;
    password: string;
}

let firstUserIdTest: string = 'testuser1';
let secondUserIdTest: string = 'testuser2';
const firstUserBody: SimpleUserModel = {
    username: 'testuser1',
    email: 'testuser1@fake.com',
    password: 'testuser1'
};
const secondUserBody: SimpleUserModel = {
    username: 'testuser2',
    email: 'testuser2@fake.com',
    password: 'testuser2'
};

/**
 * First user POST
 */
it('should POST first user to /users', async () => {
    const res = await request(app).post(`${usersRoot}`).send(firstUserBody);
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
});

/**
 * Second user POST
 */
it('should POST second user to /users', async () => {
    const res = await request(app).post(`${usersRoot}`).send(secondUserBody);
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
})

/**
 * First user GET
 */
it(`should GET /users/${firstUserIdTest}`, async () => {
    const res = await request(app).get(`${usersRoot}/${firstUserIdTest}`).send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
});

/**
 * Second user GET
 */
it(`should GET /users/${secondUserIdTest}`, async () => {
    const res = await request(app).get(`${usersRoot}/${secondUserIdTest}`).send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
});

/**
 * All users GET
 */
it(`should GET /users`, async () => {
    const res = await request(app).get(`${usersRoot}`).send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
});

/**
 * First user DELETE
 */
it(`should DELETE /users/${firstUserIdTest}`, async () => {
    const res = await request(app).delete(`${usersRoot}/${firstUserIdTest}`).send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
})


/**
 * Second user DELETE
 */
it(`should DELETE /users/${secondUserIdTest}`, async () => {
    const res = await request(app).delete(`${usersRoot}/${secondUserIdTest}`).send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
});

/**
 * All users GET
 */
 it(`should GET /users`, async () => {
    const res = await request(app).get(`${usersRoot}`).send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
});