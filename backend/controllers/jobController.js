const jobService = require('../services/jobService');
const { validateJob, validateSettings } = require('../validators/jobValidator');

exports.public = async (_req, res, next) => {
  try {
    const [jobs, settings] = await Promise.all([jobService.list({ publicOnly: true }), jobService.getSettings()]);
    res.json({ jobs, sectionVisible: settings.sectionVisible });
  } catch (error) { next(error); }
};

exports.listManage = async (_req, res, next) => {
  try {
    res.json({ jobs: await jobService.list() });
  } catch (error) { next(error); }
};

exports.getSettings = async (_req, res, next) => {
  try {
    res.json(await jobService.getSettings());
  } catch (error) { next(error); }
};

exports.saveSettings = async (req, res, next) => {
  try {
    res.json(await jobService.saveSettings(validateSettings(req.body)));
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json({ job: await jobService.create(validateJob(req.body)) });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const job = await jobService.update(req.params.id, validateJob(req.body));
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.json({ job });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await jobService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Job not found' });
    return res.status(204).end();
  } catch (error) { next(error); }
};
