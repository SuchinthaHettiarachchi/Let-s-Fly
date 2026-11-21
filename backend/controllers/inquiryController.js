const inquiryService = require('../services/inquiryService');
const { validateSubmit, validateUpdate } = require('../validators/inquiryValidator');

exports.submit = async (req, res, next) => {
  try {
    res.status(201).json({ inquiry: await inquiryService.create(validateSubmit(req.body)) });
  } catch (error) { next(error); }
};

exports.list = async (_req, res, next) => {
  try {
    res.json({ inquiries: await inquiryService.list() });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const { status, comment } = validateUpdate(req.body);
    const updated = status
      ? await inquiryService.updateStatus(req.params.id, status)
      : await inquiryService.addComment(req.params.id, comment);
    if (!updated) return res.status(404).json({ message: 'Inquiry not found' });
    return res.json({ inquiry: updated });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await inquiryService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Inquiry not found' });
    return res.status(204).end();
  } catch (error) { next(error); }
};
