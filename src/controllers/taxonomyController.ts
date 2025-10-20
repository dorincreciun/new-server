import { Request, Response } from 'express';
import { TaxonomyService } from '../services/taxonomyService';

const service = new TaxonomyService();

// TODO: protejează cu roluri admin/moderator când se activează RBAC
export class TaxonomyController {
  // Ingredients
  async listIngredients(_req: Request, res: Response) {
    const data = await service.listIngredients();
    res.json({ items: data });
  }
  async createIngredient(req: Request, res: Response) {
    const { key, label } = req.body || {};
    if (!key || typeof key !== 'string' || !key.trim()) {
      res.status(400).json({ error: 'Cheia ingredientului este obligatorie' });
      return;
    }
    try {
      const item = await service.createIngredient(key.trim(), label);
      res.status(201).json({ item });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        res.status(409).json({ error: 'Cheia ingredientului există deja' });
        return;
      }
      throw e;
    }
  }
  async updateIngredient(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { key, label } = req.body || {};
    if (Number.isNaN(id) || id <= 0) { res.status(400).json({ error: 'ID invalid' }); return; }
    try {
      const item = await service.updateIngredient(id, key, label);
      res.json({ item });
    } catch (e: any) {
      if (e?.code === 'P2002') { res.status(409).json({ error: 'Cheie duplicată' }); return; }
      if (e?.code === 'P2025') { res.status(404).json({ error: 'Ingredient inexistent' }); return; }
      throw e;
    }
  }
  async deleteIngredient(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) { res.status(400).json({ error: 'ID invalid' }); return; }
    try { await service.deleteIngredient(id); res.json({ message: 'Șters' }); }
    catch (e: any) { if (e?.code === 'P2025') { res.status(404).json({ error: 'Ingredient inexistent' }); return; } throw e; }
  }

  // Flags
  async listFlags(_req: Request, res: Response) {
    const data = await service.listFlags();
    res.json({ items: data });
  }
  async createFlag(req: Request, res: Response) {
    const { key, label } = req.body || {};
    if (!key || typeof key !== 'string' || !key.trim()) { res.status(400).json({ error: 'Cheia flagului este obligatorie' }); return; }
    try { const item = await service.createFlag(key.trim(), label); res.status(201).json({ item }); }
    catch (e: any) { if (e?.code === 'P2002') { res.status(409).json({ error: 'Cheie flag duplicată' }); return; } throw e; }
  }
  async updateFlag(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { key, label } = req.body || {};
    if (Number.isNaN(id) || id <= 0) { res.status(400).json({ error: 'ID invalid' }); return; }
    try { const item = await service.updateFlag(id, key, label); res.json({ item }); }
    catch (e: any) { if (e?.code === 'P2002') { res.status(409).json({ error: 'Cheie duplicată' }); return; } if (e?.code === 'P2025') { res.status(404).json({ error: 'Flag inexistent' }); return; } throw e; }
  }
  async deleteFlag(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) { res.status(400).json({ error: 'ID invalid' }); return; }
    try { await service.deleteFlag(id); res.json({ message: 'Șters' }); }
    catch (e: any) { if (e?.code === 'P2025') { res.status(404).json({ error: 'Flag inexistent' }); return; } throw e; }
  }

  // Variant options
  async listVariantOptions(_req: Request, res: Response) {
    const data = await service.listVariantOptions();
    res.json({ items: data });
  }
  async createVariantOption(req: Request, res: Response) {
    const { key, label } = req.body || {};
    if (!key || typeof key !== 'string' || !key.trim()) { res.status(400).json({ error: 'Cheia variantei este obligatorie' }); return; }
    try { const item = await service.createVariantOption(key.trim(), label); res.status(201).json({ item }); }
    catch (e: any) { if (e?.code === 'P2002') { res.status(409).json({ error: 'Cheie variantă duplicată' }); return; } throw e; }
  }
  async updateVariantOption(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { key, label } = req.body || {};
    if (Number.isNaN(id) || id <= 0) { res.status(400).json({ error: 'ID invalid' }); return; }
    try { const item = await service.updateVariantOption(id, key, label); res.json({ item }); }
    catch (e: any) { if (e?.code === 'P2002') { res.status(409).json({ error: 'Cheie duplicată' }); return; } if (e?.code === 'P2025') { res.status(404).json({ error: 'Variantă inexistentă' }); return; } throw e; }
  }
  async deleteVariantOption(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) { res.status(400).json({ error: 'ID invalid' }); return; }
    try { await service.deleteVariantOption(id); res.json({ message: 'Șters' }); }
    catch (e: any) { if (e?.code === 'P2025') { res.status(404).json({ error: 'Variantă inexistentă' }); return; } throw e; }
  }
}


