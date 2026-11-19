const service = require('../services/visaService');
const v = require('../validators/visaValidator');

exports.getPublic = async (_req, res, next) => { try { res.json(await service.getPublic()); } catch (e) { next(e); } };
exports.listVisas = async (_req, res, next) => { try { res.json({ visas: await service.listVisas() }); } catch (e) { next(e); } };
exports.getVisaBySlug = async (req, res, next) => { try { const visa = await service.getVisaBySlug(req.params.slug); if (!visa) return res.status(404).json({ message: 'Visa not found' }); return res.json({ visa }); } catch (e) { next(e); } };
exports.createVisa = async (req, res, next) => { try { res.status(201).json({ visa: await service.createVisa(v.validateVisa(req.body)) }); } catch (e) { next(e); } };
exports.updateVisa = async (req, res, next) => { try { const visa = await service.updateVisa(req.params.id, v.validateVisaUpdate(req.body)); if (!visa) return res.status(404).json({ message: 'Visa not found' }); return res.json({ visa }); } catch (e) { next(e); } };
exports.deleteVisa = async (req, res, next) => { try { const visa = await service.deleteVisa(req.params.id); if (!visa) return res.status(404).json({ message: 'Visa not found' }); return res.status(204).end(); } catch (e) { next(e); } };

exports.listCategories = async (_req, res, next) => { try { res.json({ categories: await service.listCategories() }); } catch (e) { next(e); } };
exports.createCategory = async (req, res, next) => { try { res.status(201).json({ category: await service.createCategory(v.validateVisaCategory(req.body)) }); } catch (e) { next(e); } };
exports.updateCategory = async (req, res, next) => { try { const category = await service.updateCategory(req.params.id, v.validateVisaCategoryUpdate(req.body)); if (!category) return res.status(404).json({ message: 'Category not found' }); return res.json({ category }); } catch (e) { next(e); } };
exports.deleteCategory = async (req, res, next) => { try { const category = await service.deleteCategory(req.params.id); if (!category) return res.status(404).json({ message: 'Category not found' }); return res.status(204).end(); } catch (e) { next(e); } };

exports.listCountries = async (_req, res, next) => { try { res.json({ countries: await service.listCountries() }); } catch (e) { next(e); } };
exports.createCountry = async (req, res, next) => { try { res.status(201).json({ country: await service.createCountry(v.validateVisaCountry(req.body)) }); } catch (e) { next(e); } };
exports.updateCountry = async (req, res, next) => { try { const country = await service.updateCountry(req.params.id, v.validateVisaCountryUpdate(req.body)); if (!country) return res.status(404).json({ message: 'Country not found' }); return res.json({ country }); } catch (e) { next(e); } };
exports.deleteCountry = async (req, res, next) => { try { const country = await service.deleteCountry(req.params.id); if (!country) return res.status(404).json({ message: 'Country not found' }); return res.status(204).end(); } catch (e) { next(e); } };

exports.getPage = async (_req, res, next) => { try { res.json({ page: await service.getPage() }); } catch (e) { next(e); } };
exports.savePage = async (req, res, next) => { try { res.json({ page: await service.savePage(v.validateVisaPage(req.body)) }); } catch (e) { next(e); } };
