import { Router } from "express";
import passport from 'passport';
import errorHandler from "../middlewares/errors/err.js";
import { addLogger } from "../logger.js";

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
        this.router.get(path, addLogger, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, addLogger, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, addLogger, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, addLogger, this.setUserIfSigned("jwt"), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    applyCallbacks(callbacks) {
        //mapeamos cada callback y obtenemos sus parametros
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                errorHandler(error, ...params);
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
            return res.status(400).render("unauthenticated", {
                style: "unauthenticated.css",
                title: 'User not authenticated',
                excludePartial: true
            });
        } else {
            if (!policies.includes(req.user.user.role.toUpperCase())) {
                return res.status(403).render("forbidden", {
                    style: "forbidden.css",
                    title: 'Forbidden',
                    excludePartial: true
                });
            }
        }
        next();

    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({ status: "success", payload });
        res.sendServerError = () => res.status(500).render("internalerror", {
            style: "internalerror.css",
            title: '500 Error',
            excludePartial: true
        });
        res.sendUserError = error => res.status(400).send({ status: "error", error });
        res.sendForbidden = () => res.status(403).render("forbidden", {
            style: "forbidden.css",
            title: 'Forbidden',
            excludePartial: true
        });
        next();
    }

    setUserIfSigned = (strategy) => {
        return async (req, res, next) => {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next();
                }
                req.user = user;
                next();
            })(req, res, next);
        }
    }

}