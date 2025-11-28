import CrisisPhrase from "../models/CrisisPhrase.js";
import RiskPhraseHistory from "../models/RiskPhraseHistory.js";

async function log(phraseId, action, oldValue, newValue, userId) {
  await RiskPhraseHistory.create({
    phraseId,
    action,
    oldValue,
    newValue,
    performedBy: userId
  });
}

export async function getPhrases(req, res) {
  try {
    const list = await CrisisPhrase.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo frases" });
  }
}

export async function createPhrase(req, res) {
  try {
    const { text, category } = req.body;

    const phrase = await CrisisPhrase.create({ text, category, active: true });

    await log(phrase._id, "CREATED", null, phrase.toObject(), req.user.id);

    res.json(phrase);
  } catch (err) {
    res.status(500).json({ msg: "Error creando frase" });
  }
}

export async function updatePhrase(req, res) {
  try {
    const { id } = req.params;

    const old = await CrisisPhrase.findById(id);

    const updated = await CrisisPhrase.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    await log(id, "UPDATED", old.toObject(), updated.toObject(), req.user.id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error actualizando frase" });
  }
}

export async function deletePhrase(req, res) {
  try {
    const phrase = await CrisisPhrase.findById(req.params.id);
    if (!phrase) return res.status(404).json({ msg: "No encontrada" });

    await log(phrase._id, "DELETED", phrase.toObject(), null, req.user.id);

    await phrase.deleteOne();

    res.json({ msg: "Frase eliminada" });
  } catch (err) {
    res.status(500).json({ msg: "Error eliminando frase" });
  }
}
