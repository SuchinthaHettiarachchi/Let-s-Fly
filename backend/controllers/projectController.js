const projectService = require('../services/projectService');
const { validateProject } = require('../validators/projectValidator');

exports.listPublic = async (_req, res, next) => {
  try {
    res.json({ projects: await projectService.list({ publishedOnly: true }) });
  } catch (error) { next(error); }
};

exports.listManage = async (_req, res, next) => {
  try {
    res.json({ projects: await projectService.list() });
  } catch (error) { next(error); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const project = await projectService.getBySlug(req.params.slug);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json({ project });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const project = await projectService.create(validateProject(req.body));
    res.status(201).json({ project });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const project = await projectService.update(req.params.id, validateProject(req.body));
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json({ project });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await projectService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Project not found' });
    return res.status(204).end();
  } catch (error) { next(error); }
};
