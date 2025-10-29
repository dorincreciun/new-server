"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyController = void 0;
const taxonomyService_1 = require("../services/taxonomyService");
const service = new taxonomyService_1.TaxonomyService();
// TODO: protejează cu roluri admin/moderator când se activează RBAC
class TaxonomyController {
    // Ingredients
    async listIngredients(_req, res) {
        const data = await service.listIngredients();
        res.json({ items: data });
    }
    async createIngredient(req, res) {
        const { key, label } = req.body || {};
        if (!key || typeof key !== 'string' || !key.trim()) {
            res.status(400).json({ error: 'Cheia ingredientului este obligatorie' });
            return;
        }
        try {
            const item = await service.createIngredient(key.trim(), label);
            res.status(201).json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheia ingredientului există deja' });
                return;
            }
            throw e;
        }
    }
    async updateIngredient(req, res) {
        const id = Number(req.params.id);
        const { key, label } = req.body || {};
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            const item = await service.updateIngredient(id, key, label);
            res.json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie duplicată' });
                return;
            }
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Ingredient inexistent' });
                return;
            }
            throw e;
        }
    }
    async deleteIngredient(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            await service.deleteIngredient(id);
            res.json({ message: 'Șters' });
        }
        catch (e) {
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Ingredient inexistent' });
                return;
            }
            throw e;
        }
    }
    // Flags
    async listFlags(_req, res) {
        const data = await service.listFlags();
        res.json({ items: data });
    }
    async createFlag(req, res) {
        const { key, label } = req.body || {};
        if (!key || typeof key !== 'string' || !key.trim()) {
            res.status(400).json({ error: 'Cheia flagului este obligatorie' });
            return;
        }
        try {
            const item = await service.createFlag(key.trim(), label);
            res.status(201).json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie flag duplicată' });
                return;
            }
            throw e;
        }
    }
    async updateFlag(req, res) {
        const id = Number(req.params.id);
        const { key, label } = req.body || {};
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            const item = await service.updateFlag(id, key, label);
            res.json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie duplicată' });
                return;
            }
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Flag inexistent' });
                return;
            }
            throw e;
        }
    }
    async deleteFlag(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            await service.deleteFlag(id);
            res.json({ message: 'Șters' });
        }
        catch (e) {
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Flag inexistent' });
                return;
            }
            throw e;
        }
    }
    // Dough types
    async listDoughTypes(_req, res) {
        const data = await service.listDoughTypes();
        res.json({ items: data });
    }
    async createDoughType(req, res) {
        const { key, label } = req.body || {};
        if (!key || typeof key !== 'string' || !key.trim()) {
            res.status(400).json({ error: 'Cheia tipului de aluat este obligatorie' });
            return;
        }
        try {
            const item = await service.createDoughType(key.trim(), label);
            res.status(201).json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie tip aluat duplicată' });
                return;
            }
            throw e;
        }
    }
    async updateDoughType(req, res) {
        const id = Number(req.params.id);
        const { key, label } = req.body || {};
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            const item = await service.updateDoughType(id, key, label);
            res.json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie duplicată' });
                return;
            }
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Tip aluat inexistent' });
                return;
            }
            throw e;
        }
    }
    async deleteDoughType(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            await service.deleteDoughType(id);
            res.json({ message: 'Șters' });
        }
        catch (e) {
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Tip aluat inexistent' });
                return;
            }
            throw e;
        }
    }
    // Size options
    async listSizeOptions(_req, res) {
        const data = await service.listSizeOptions();
        res.json({ items: data });
    }
    async createSizeOption(req, res) {
        const { key, label } = req.body || {};
        if (!key || typeof key !== 'string' || !key.trim()) {
            res.status(400).json({ error: 'Cheia opțiunii de mărime este obligatorie' });
            return;
        }
        try {
            const item = await service.createSizeOption(key.trim(), label);
            res.status(201).json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie opțiune mărime duplicată' });
                return;
            }
            throw e;
        }
    }
    async updateSizeOption(req, res) {
        const id = Number(req.params.id);
        const { key, label } = req.body || {};
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            const item = await service.updateSizeOption(id, key, label);
            res.json({ item });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                res.status(409).json({ error: 'Cheie duplicată' });
                return;
            }
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Opțiune mărime inexistentă' });
                return;
            }
            throw e;
        }
    }
    async deleteSizeOption(req, res) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalid' });
            return;
        }
        try {
            await service.deleteSizeOption(id);
            res.json({ message: 'Șters' });
        }
        catch (e) {
            if (e?.code === 'P2025') {
                res.status(404).json({ error: 'Opțiune mărime inexistentă' });
                return;
            }
            throw e;
        }
    }
}
exports.TaxonomyController = TaxonomyController;
//# sourceMappingURL=taxonomyController.js.map