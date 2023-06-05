import { Router } from "express";
import passport from 'passport';

export default class CRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() { }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    applyCallbacks(callbacks) {
        //mapeamos cada callback y obtenemos sus parametros
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                console.log(error);
                //params[1] es res, por lo que se puede mandar un send
                params[1].status(500).send(error);
            }
        })
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === "PUBLIC") {
            //No es necesario autenticarse
            return next();
        }
    
        if (!req.user) {
            //No hay usuario y esta ya no es una ruta publica.
            //Se devuelve error por falta de autenticacion.
            return res.status(400).send({ status: "error", error: "Not authenticated"});
        } else {
            if (!policies.includes(req.user.user.role.toUpperCase())) {
                return res.status(403).send({ error: "Your role doesn't match this site policy. Forbidden." });
            }
        }
        next();

    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({ status: "success", payload });
        res.sendServerError = error => res.status(500).send({ status: "error", error });
        res.sendUserError = error => res.status(400).send({ status: "error", error });
        res.sendForbidden = error => res.status(403).send({ status: "error", error });
        next();
    }

    setUserIfSigned = (strategy) => {
        return async (req, res, next) => {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    console.log("There is no user");
                    return next();
                }
                req.user = user;
                next();
            })(req, res, next);
        }
    }

}