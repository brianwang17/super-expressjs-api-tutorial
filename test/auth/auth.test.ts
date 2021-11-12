import app from '../../app';
import { agent as request } from 'supertest';
import { expect } from 'chai';
import { routeResources } from '../../app/shared/routeResources/routeResources';

const { usersRoot, authRoot, authRefreshToken } = routeResources;

let firstUserBody = {
    username: 'jaymee_sirewich',
    email: 'jaymee_sirewich@fake.com',
    password: 'MRre1!'
};

let jwt = {
    accessToken: '',
    refreshToken: ''
};

it('should POST /users', async () => {
    const res = await request(app).post('/users').send(firstUserBody);
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.an('string');
});

it('should POST to /auth and retrieve a refresh and access token', async () => {
    const res = await request(app).post(`${authRoot}`).send({
        email: firstUserBody.email,
        password: firstUserBody.password
    });

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.an('string');
    expect(res.body.refreshToken).to.be.an('string');

    jwt.accessToken = res.body.accessToken;
    jwt.refreshToken = res.body.refreshToken;
});

it(`should POST to /auth/refresh-token and receive 403 for having an invalid JWT`, async () => {
    const res = await request(app).post(`${authRefreshToken}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt.accessToken}123123`)
        .set('Cookie', `refreshToken=${jwt.refreshToken}`)
        .send();
    expect(res.status).to.equal(403);
});

it(`should POST to /auth/refresh-token and receive 401 for not having a JWT set`, async () => {
    const res = await request(app).post(`${authRefreshToken}`)
        .set('Accept', 'application/json')
        .set('Cookie', `refreshToken=${jwt.refreshToken}`)
        .send();
    expect(res.status).to.equal(401);
});

it(`should POST to /auth/refresh-token and receive 400 for having an invalid refreshToken`, async () => {
    const res = await request(app).post(`${authRefreshToken}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt.accessToken}`)
        .set('Cookie', 'refreshToken=123')
        .send();
    expect(res.status).to.equal(400);
});

it(`should POST to /auth/refresh-token and retrieve 200 with a new access token`, async () => {
    const res = await request(app).post(`${authRefreshToken}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt.accessToken}`)
        .set('Cookie', `refreshToken=${jwt.refreshToken}`)
        .send();
    expect(res.status).to.equal(201)
    expect(res.body).not.to.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.an('string');
    expect(res.body.refreshToken).to.be.an('string');
    jwt.accessToken = res.body.accessToken;
    jwt.refreshToken = res.body.refreshToken;
});

it(`should DELETE /users/:userId`, async () => {
    const res = await request(app).delete(`${usersRoot}/${firstUserBody.username}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt.accessToken}`)
        .set('Cookie', `refreshToken=${jwt.refreshToken}`)
        .send();

    expect(res.status).to.equal(200);
});