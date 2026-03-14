const { Router } = require("express");
const ChapterController = require("#presentation/controllers/ChapterController");

const router = Router();
const c = new ChapterController();

// Chapters
router.get("/", (req, res) => c.all(req, res));
router.post("/", (req, res) => c.create(req, res));
router.post("/reorder", (req, res) => c.reorder(req, res));
router.get("/:id", (req, res) => c.findById(req, res));
router.put("/:id", (req, res) => c.update(req, res));
router.delete("/:id", (req, res) => c.destroy(req, res));

// Areas
router.get("/:id/areas", (req, res) => c.listAreas(req, res));
router.post("/:id/areas", (req, res) => c.createArea(req, res));
router.post("/:id/areas/reorder", (req, res) => c.reorderArea(req, res));
router.put("/:id/areas/:areaId", (req, res) => c.updateArea(req, res));
router.delete("/:id/areas/:areaId", (req, res) => c.destroyArea(req, res));

// Card Types (under area)
router.get("/:id/areas/:areaId/card-types", (req, res) => c.listCardTypes(req, res));
router.post("/:id/areas/:areaId/card-types", (req, res) => c.createCardType(req, res));
router.post("/:id/areas/:areaId/card-types/reorder", (req, res) => c.reorderCardType(req, res));
router.put("/:id/areas/:areaId/card-types/:typeId", (req, res) => c.updateCardType(req, res));
router.delete("/:id/areas/:areaId/card-types/:typeId", (req, res) => c.destroyCardType(req, res));

module.exports = router;
