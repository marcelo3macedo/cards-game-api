const Chapter = require("#infrastructure/db/models/Chapter");
const ChapterArea = require("#infrastructure/db/models/ChapterArea");
const ChapterCardType = require("#infrastructure/db/models/ChapterCardType");

class ChapterController {
	async all(req, res) {
		try {
			const chapters = await Chapter.findAll({
				order: [["order", "ASC"], ["id", "ASC"]],
			});
			res.json(chapters);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async findById(req, res) {
		try {
			const chapter = await Chapter.findByPk(req.params.id, {
				include: [{
					model: ChapterArea,
					as: "areas",
					include: [{ model: ChapterCardType, as: "cardTypes" }],
				}],
			});
			if (!chapter) return res.status(404).json({ error: "Capítulo não encontrado" });
			res.json(chapter);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async create(req, res) {
		try {
			const { name, description } = req.body;
			const maxOrder = await Chapter.max("order") || 0;
			const chapter = await Chapter.create({ name, description, order: maxOrder + 1 });
			res.status(201).json(chapter);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async update(req, res) {
		try {
			const chapter = await Chapter.findByPk(req.params.id);
			if (!chapter) return res.status(404).json({ error: "Capítulo não encontrado" });
			await chapter.update({ name: req.body.name, description: req.body.description });
			res.json(chapter);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async destroy(req, res) {
		try {
			const chapter = await Chapter.findByPk(req.params.id);
			if (!chapter) return res.status(404).json({ error: "Capítulo não encontrado" });
			await chapter.destroy();
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async reorder(req, res) {
		try {
			const { id, direction } = req.body;
			const chapter = await Chapter.findByPk(id);
			if (!chapter) return res.status(404).json({ error: "Capítulo não encontrado" });
			const all = await Chapter.findAll({ order: [["order", "ASC"], ["id", "ASC"]] });
			const index = all.findIndex((c) => c.id === chapter.id);
			const swapIndex = direction === "up" ? index - 1 : index + 1;
			if (swapIndex < 0 || swapIndex >= all.length) return res.json({ success: true });
			const swap = all[swapIndex];
			const tmp = chapter.order;
			await chapter.update({ order: swap.order });
			await swap.update({ order: tmp });
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// --- Areas ---

	async listAreas(req, res) {
		try {
			const areas = await ChapterArea.findAll({
				where: { chapterId: req.params.id },
				include: [{ model: ChapterCardType, as: "cardTypes", order: [["order", "ASC"]] }],
				order: [["order", "ASC"], ["id", "ASC"]],
			});
			res.json(areas);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async createArea(req, res) {
		try {
			const chapterId = req.params.id;
			const { name, description } = req.body;
			const maxOrder = await ChapterArea.max("order", { where: { chapterId } }) || 0;
			const area = await ChapterArea.create({ name, description, chapterId, order: maxOrder + 1 });
			res.status(201).json(area);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateArea(req, res) {
		try {
			const area = await ChapterArea.findByPk(req.params.areaId);
			if (!area) return res.status(404).json({ error: "Área não encontrada" });
			await area.update({ name: req.body.name, description: req.body.description });
			res.json(area);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async destroyArea(req, res) {
		try {
			const area = await ChapterArea.findByPk(req.params.areaId);
			if (!area) return res.status(404).json({ error: "Área não encontrada" });
			await area.destroy();
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async reorderArea(req, res) {
		try {
			const { areaId, direction } = req.body;
			const area = await ChapterArea.findByPk(areaId);
			if (!area) return res.status(404).json({ error: "Área não encontrada" });
			const all = await ChapterArea.findAll({
				where: { chapterId: area.chapterId },
				order: [["order", "ASC"], ["id", "ASC"]],
			});
			const index = all.findIndex((a) => a.id === area.id);
			const swapIndex = direction === "up" ? index - 1 : index + 1;
			if (swapIndex < 0 || swapIndex >= all.length) return res.json({ success: true });
			const swap = all[swapIndex];
			const tmp = area.order;
			await area.update({ order: swap.order });
			await swap.update({ order: tmp });
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// --- Card Types (under area) ---

	async listCardTypes(req, res) {
		try {
			const cardTypes = await ChapterCardType.findAll({
				where: { areaId: req.params.areaId },
				order: [["order", "ASC"], ["id", "ASC"]],
			});
			res.json(cardTypes);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async createCardType(req, res) {
		try {
			const areaId = req.params.areaId;
			const { name, rarity, type, cardClass } = req.body;
			const maxOrder = await ChapterCardType.max("order", { where: { areaId } }) || 0;
			const cardType = await ChapterCardType.create({ name, rarity, type, cardClass, areaId, order: maxOrder + 1 });
			res.status(201).json(cardType);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateCardType(req, res) {
		try {
			const cardType = await ChapterCardType.findByPk(req.params.typeId);
			if (!cardType) return res.status(404).json({ error: "Tipo de carta não encontrado" });
			const { name, rarity, type, cardClass } = req.body;
			await cardType.update({ name, rarity, type, cardClass });
			res.json(cardType);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async destroyCardType(req, res) {
		try {
			const cardType = await ChapterCardType.findByPk(req.params.typeId);
			if (!cardType) return res.status(404).json({ error: "Tipo de carta não encontrado" });
			await cardType.destroy();
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async reorderCardType(req, res) {
		try {
			const { typeId, direction } = req.body;
			const cardType = await ChapterCardType.findByPk(typeId);
			if (!cardType) return res.status(404).json({ error: "Tipo de carta não encontrado" });
			const all = await ChapterCardType.findAll({
				where: { areaId: cardType.areaId },
				order: [["order", "ASC"], ["id", "ASC"]],
			});
			const index = all.findIndex((t) => t.id === cardType.id);
			const swapIndex = direction === "up" ? index - 1 : index + 1;
			if (swapIndex < 0 || swapIndex >= all.length) return res.json({ success: true });
			const swap = all[swapIndex];
			const tmp = cardType.order;
			await cardType.update({ order: swap.order });
			await swap.update({ order: tmp });
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = ChapterController;
