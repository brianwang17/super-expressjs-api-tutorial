import { Application } from 'express';

export class CommonRoutesConfig {

    constructor(app: Application, name: string) {
        this.app = app;
        this.name = name;
    }

    app: Application;
    name: string;

    getName = () => {
        return this.name;
    }
}

export interface configureRoutes {}