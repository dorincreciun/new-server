import { Request, Response } from 'express';
export declare class TaxonomyController {
    listIngredients(_req: Request, res: Response): Promise<void>;
    createIngredient(req: Request, res: Response): Promise<void>;
    updateIngredient(req: Request, res: Response): Promise<void>;
    deleteIngredient(req: Request, res: Response): Promise<void>;
    listFlags(_req: Request, res: Response): Promise<void>;
    createFlag(req: Request, res: Response): Promise<void>;
    updateFlag(req: Request, res: Response): Promise<void>;
    deleteFlag(req: Request, res: Response): Promise<void>;
    listDoughTypes(_req: Request, res: Response): Promise<void>;
    createDoughType(req: Request, res: Response): Promise<void>;
    updateDoughType(req: Request, res: Response): Promise<void>;
    deleteDoughType(req: Request, res: Response): Promise<void>;
    listSizeOptions(_req: Request, res: Response): Promise<void>;
    createSizeOption(req: Request, res: Response): Promise<void>;
    updateSizeOption(req: Request, res: Response): Promise<void>;
    deleteSizeOption(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=taxonomyController.d.ts.map