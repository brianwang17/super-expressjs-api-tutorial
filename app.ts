import express from 'express';
import { 
	Server,
	createServer
} from 'http';
import { CommonRoutesConfig } from './app/common/common.routes.config';
import { UsersRoutes } from './app/users/users.routes.config';
import { AuthRoutes } from './app/auth/auth.routes.config';
import { routeResources } from './app/shared/routeResources/routeResources';
import cookieParser from 'cookie-parser';

const app: express.Application = express();
const server: Server = createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];

app.use(express.json());
app.use(cookieParser());

// Push User routes
routes.push(new UsersRoutes(app));

// Push Auth routes
routes.push(new AuthRoutes(app));

app.get(`${routeResources.rootResource}`, (req: express.Request, res: express.Response) => {
	res.status(200).send(`Server running at port ${port}`)
});

server.listen(port, () => {
	console.log(`Server running at port ${port}`);
	routes.forEach((route: CommonRoutesConfig) => {
		console.log(`Routes configured for ${route.getName()}`);
	});
});

export default app;