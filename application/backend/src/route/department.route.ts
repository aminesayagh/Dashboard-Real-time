import express from 'express';
const router = express.Router();

router.get('/', async () => {});
router.post('/', async () => {});
router.get('/:id', async () => {});
router.put('/:id', async () => {});
router.delete('/:id', async () => {});
router.get('/:id/locations', async () => {});
router.post('/:id/locations', async () => {});
router.get('/:id/locations/:location_id', async () => {});
router.put('/:id/locations/:location_id', async () => {});
router.delete('/:id/locations/:location_id', async () => {});
router.get('/:id/postulations', async () => {});
router.post('/:id/postulations', async () => {});
router.get('/:id/postulations/:postulation_id', async () => {});
router.put('/:id/postulations/:postulation_id', async () => {});
router.delete('/:id/postulations/:postulation_id', async () => {});

export default router;