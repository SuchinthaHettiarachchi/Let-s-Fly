const { httpError } = require('../middleware/error');

const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const str = (v, field, max, required = false) => {
  if (v === undefined || v === null || v === '') {
    if (required) throw httpError(400, `${field} is required`);
    return '';
  }
  if (typeof v !== 'string') throw httpError(400, `${field} must be a string`);
  const s = v.trim();
  if (required && !s) throw httpError(400, `${field} is required`);
  if (max && s.length > max) throw httpError(400, `${field} is too long`);
  return s;
};

const keyOf = (v, field = 'Key') => {
  const s = str(v, field, 80, true).toLowerCase();
  if (!KEY_RE.test(s)) throw httpError(400, `${field} must be lowercase letters, numbers and hyphens only`);
  return s;
};

const num = (v, fallback = 0) => {
  if (v === undefined || v === null || v === '') return fallback;
  const n = typeof v === 'string' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n)) throw httpError(400, 'Must be a number');
  return n;
};

const arr = (v) => (Array.isArray(v) ? v : []);

exports.validateVisaCategory = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  return { key: keyOf(body.key), label: str(body.label, 'Label', 120, true), sortOrder: num(body.sortOrder, 0) };
};

exports.validateVisaCategoryUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const out = {};
  if (body.key !== undefined) out.key = keyOf(body.key);
  if (body.label !== undefined) out.label = str(body.label, 'Label', 120, true);
  if (body.sortOrder !== undefined) out.sortOrder = num(body.sortOrder, 0);
  if (!Object.keys(out).length) throw httpError(400, 'Nothing to update');
  return out;
};

exports.validateVisaCountry = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Country data is required');
  return { key: keyOf(body.key), label: str(body.label, 'Label', 120, true), sortOrder: num(body.sortOrder, 0) };
};

exports.validateVisaCountryUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Country data is required');
  const out = {};
  if (body.key !== undefined) out.key = keyOf(body.key);
  if (body.label !== undefined) out.label = str(body.label, 'Label', 120, true);
  if (body.sortOrder !== undefined) out.sortOrder = num(body.sortOrder, 0);
  if (!Object.keys(out).length) throw httpError(400, 'Nothing to update');
  return out;
};

const validateFacts = (items) => arr(items).map((f) => ({ icon: str(f?.icon, 'Icon', 80), label: str(f?.label, 'Label', 160) })).filter((f) => f.icon || f.label);
const validateDocItems = (items) => arr(items).map((i) => ({ title: str(i?.title, 'Title', 300), note: str(i?.note, 'Note', 500) })).filter((i) => i.title || i.note);
const validateDocGroups = (groups) => arr(groups).map((g) => ({ title: str(g?.title, 'Title', 200), items: validateDocItems(g?.items) })).filter((g) => g.title || g.items.length);
const validateFeeItems = (items) => arr(items).map((i) => ({ label: str(i?.label, 'Label', 200), value: str(i?.value, 'Value', 120), note: str(i?.note, 'Note', 300) })).filter((i) => i.label || i.value || i.note);
const validateFeeGroups = (groups) => arr(groups).map((g) => ({ title: str(g?.title, 'Title', 200), items: validateFeeItems(g?.items) })).filter((g) => g.title || g.items.length);
const validateExtraSections = (sections) => arr(sections).map((s) => ({ title: str(s?.title, 'Title', 200), body: str(s?.body, 'Body', 4000), items: validateDocItems(s?.items) })).filter((s) => s.title || s.body || s.items.length);

exports.validateVisa = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Visa data is required');
  return {
    slug: keyOf(body.slug, 'Slug'),
    countryKey: str(body.countryKey, 'Country key', 80).toLowerCase(),
    country: str(body.country, 'Country', 120),
    city: str(body.city, 'City', 120),
    categoryKey: str(body.categoryKey, 'Category key', 80).toLowerCase(),
    type: str(body.type, 'Type', 120),
    image: str(body.image, 'Image', 1000),
    flag: str(body.flag, 'Flag', 1000),
    summary: str(body.summary, 'Summary', 4000),
    facts: validateFacts(body.facts),
    documentGroups: validateDocGroups(body.documentGroups),
    warning: str(body.warning, 'Warning', 2000),
    feeGroups: validateFeeGroups(body.feeGroups),
    extraSections: validateExtraSections(body.extraSections),
    sortOrder: num(body.sortOrder, 0),
  };
};

exports.validateVisaUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Visa data is required');
  const out = {};
  if (body.slug !== undefined) out.slug = keyOf(body.slug, 'Slug');
  if (body.countryKey !== undefined) out.countryKey = str(body.countryKey, 'Country key', 80).toLowerCase();
  if (body.country !== undefined) out.country = str(body.country, 'Country', 120);
  if (body.city !== undefined) out.city = str(body.city, 'City', 120);
  if (body.categoryKey !== undefined) out.categoryKey = str(body.categoryKey, 'Category key', 80).toLowerCase();
  if (body.type !== undefined) out.type = str(body.type, 'Type', 120);
  if (body.image !== undefined) out.image = str(body.image, 'Image', 1000);
  if (body.flag !== undefined) out.flag = str(body.flag, 'Flag', 1000);
  if (body.summary !== undefined) out.summary = str(body.summary, 'Summary', 4000);
  if (body.facts !== undefined) out.facts = validateFacts(body.facts);
  if (body.documentGroups !== undefined) out.documentGroups = validateDocGroups(body.documentGroups);
  if (body.warning !== undefined) out.warning = str(body.warning, 'Warning', 2000);
  if (body.feeGroups !== undefined) out.feeGroups = validateFeeGroups(body.feeGroups);
  if (body.extraSections !== undefined) out.extraSections = validateExtraSections(body.extraSections);
  if (body.sortOrder !== undefined) out.sortOrder = num(body.sortOrder, 0);
  if (!Object.keys(out).length) throw httpError(400, 'Nothing to update');
  return out;
};

const validateSteps = (items) => arr(items).map((s) => ({ title: str(s?.title, 'Title', 120), text: str(s?.text, 'Text', 500) })).filter((s) => s.title || s.text);
const validateSlFacts = (items) => arr(items).map((f) => ({ label: str(f?.label, 'Label', 120), value: str(f?.value, 'Value', 120) })).filter((f) => f.label || f.value);
const validateSriLankaVisas = (items) => arr(items).map((v) => ({
  name: str(v?.name, 'Name', 160),
  short: str(v?.short, 'Short name', 80),
  icon: str(v?.icon, 'Icon', 80),
  image: str(v?.image, 'Image', 1000),
  text: str(v?.text, 'Text', 1000),
  purposes: arr(v?.purposes).map((p) => str(p, 'Purpose', 160)).filter(Boolean),
  facts: validateSlFacts(v?.facts),
})).filter((v) => v.name || v.short || v.text || v.purposes.length || v.facts.length);
const validateResidence = (items) => arr(items).map((r) => ({
  title: str(r?.title, 'Title', 160),
  icon: str(r?.icon, 'Icon', 80),
  text: str(r?.text, 'Text', 1000),
  highlight: str(r?.highlight, 'Highlight', 160),
})).filter((r) => r.title || r.text || r.icon || r.highlight);

exports.validateVisaPage = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Visa page data is required');
  return {
    outboundEyebrow: str(body.outboundEyebrow, 'Outbound eyebrow', 120),
    outboundTitle: str(body.outboundTitle, 'Outbound title', 200),
    inboundEyebrow: str(body.inboundEyebrow, 'Inbound eyebrow', 120),
    inboundTitle: str(body.inboundTitle, 'Inbound title', 200),
    inboundIntro: str(body.inboundIntro, 'Inbound intro', 2000),
    residenceEyebrow: str(body.residenceEyebrow, 'Residence eyebrow', 120),
    residenceTitle: str(body.residenceTitle, 'Residence title', 200),
    residenceDescription: str(body.residenceDescription, 'Residence description', 2000),
    residenceRenewalTitle: str(body.residenceRenewalTitle, 'Renewal title', 160),
    residenceRenewalText: str(body.residenceRenewalText, 'Renewal text', 1000),
    rulesNote: str(body.rulesNote, 'Rules note', 2000),
    stepsEyebrow: str(body.stepsEyebrow, 'Steps eyebrow', 120),
    stepsTitle: str(body.stepsTitle, 'Steps title', 200),
    steps: validateSteps(body.steps),
    sriLankaVisas: validateSriLankaVisas(body.sriLankaVisas),
    residenceCategories: validateResidence(body.residenceCategories),
  };
};
