import express from 'express';
const router = express.Router();

router.post('/', async () => {});
router.get('/', async () => {});
router.put('/:id', async () => {});
router.get('/:id', async () => {});
router.put('/:id/attachment', async () => {});
router.get('/:id/attachment', async () => {});
router.post('/:id/attachment', async () => {});
router.delete('/:id/attachment/:attachment_id', async () => {});

export default router;